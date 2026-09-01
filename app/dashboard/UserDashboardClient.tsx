/**
 * PURPOSE:
 * Thin orchestrator for the User Dashboard page. Owns all shared state and async
 * handlers for the dashboard, then composes and wires together the extracted
 * sub-components. Uses useMemo and useCallback to prevent unnecessary re-renders
 * of heavy child components like FullCalendar.
 *
 * CONTEXT/PARENT FILE:
 * Entry-point client component for the /dashboard route. Receives server-fetched
 * profile and language data as props from the page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - profile (ProfileUncheckedCreateInput | null, Required): The authenticated user's profile data.
 * - allLanguages (LanguageUncheckedCreateInput[], Optional): Full list of platform languages. Defaults to [].
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { ProfileUpdationDto } from "@/app/types/profile";
import { SlotCreationDto } from "@/app/types/slot";
import { SlotStatus } from "@/app/types/enum";
import {
  LanguageUncheckedCreateInput,
  UserLanguageUncheckedCreateInput,
  SlotUncheckedCreateInput,
  ProfileUncheckedCreateInput,
} from "@/app/types";
import { updateProfile, updateProfileImage } from "@/app/services/profile";
import { createSlot } from "@/app/services/slots";
import { deleteUserSlot } from "@/app/services/slots/delete-user-slot";
import { createUserLanguage, deleteUserLanguage } from "@/app/services/user-language";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

import { DateSelectArg, SlotFormInput } from "./components/types";
import { buildCalendarEvents } from "./components/helpers";
import AvatarUploader from "./components/AvatarUploader";
import ProfileForm from "./components/ProfileForm";
import UserLanguagesSection from "./components/UserLanguagesSection";
import SlotCalendar from "./components/SlotCalendar";
import CreateSlotModal from "./components/CreateSlotModal";
import SlotDetailModal from "./components/SlotDetailModal";
import BookedSlotsSection, { BookedSlotItem } from "./components/BookedSlotsSection";

interface UserDashboardClientProps {
  profile: ProfileUncheckedCreateInput | null;
  allLanguages?: LanguageUncheckedCreateInput[];
}

/**
 * UserDashboardClient
 *
 * BEHAVIORAL MECHANISM:
 * Serves as the main container for user dashboard features. Manages local state
 * for avatar previews, user languages, provided and exchanged slots, date selections,
 * and modal visibilities. Employs memoization hooks to ensure sub-components like
 * SlotCalendar do not re-render unnecessarily.
 *
 * PARAMETERS:
 * - props (UserDashboardClientProps): Contains profile data and allLanguages array.
 *
 * RETURNS:
 * - JSX.Element: The user dashboard layout with profile form, language section, calendar, and modals.
 */
export default function UserDashboardClient({
  profile,
  allLanguages = [],
}: UserDashboardClientProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { setIsOpenLoader, isOpenLoader } = useLoader();

  // State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [userLangs, setUserLangs] = useState<UserLanguageUncheckedCreateInput[]>(
    profile?.userlanguage || []
  );
  const [provideSlots, setProvideSlots] = useState<SlotUncheckedCreateInput[]>(
    profile?.provideSlots || []
  );
  const [exchangeSlots, setExchangeSlots] = useState<SlotUncheckedCreateInput[]>(
    profile?.exchangeSlots || []
  );
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(
    null
  );
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [selectedSlotDetail, setSelectedSlotDetail] = useState<{
    slot: SlotUncheckedCreateInput;
    isOwner: boolean;
    status: SlotStatus;
  } | null>(null);

  // Derived values — memoized to avoid reference changes on re-renders
  const provideLanguageOptions = useMemo(() => {
    const advancedUserLangs = userLangs.filter((ul) => ul.proficiency === "ADVANCED");
    return advancedUserLangs
      .map((ul) => {
        const langObj = allLanguages.find((l) => l.id === ul.languageId);
        return langObj && langObj.id ? { id: langObj.id, name: langObj.name } : null;
      })
      .filter(Boolean) as { id: string; name: string }[];
  }, [userLangs, allLanguages]);

  const calendarEvents = useMemo(
    () => buildCalendarEvents(provideSlots, exchangeSlots),
    [provideSlots, exchangeSlots]
  );

  const allBookedSlots = useMemo(() => {
    const bookedProvide: BookedSlotItem[] = provideSlots
      .filter((s) => s.status === SlotStatus.BOOKED)
      .map((slot) => ({ slot, isOwner: true, status: SlotStatus.BOOKED }));

    const bookedExchange: BookedSlotItem[] = exchangeSlots
      .filter((s) => s.status === SlotStatus.BOOKED)
      .map((slot) => ({ slot, isOwner: false, status: SlotStatus.BOOKED }));

    const combined = [...bookedProvide, ...bookedExchange];
    combined.sort(
      (a, b) =>
        new Date(a.slot.startTime).getTime() - new Date(b.slot.startTime).getTime()
    );
    return combined;
  }, [provideSlots, exchangeSlots]);

  const displayAvatar = avatarPreview || profile?.publicAvatarUrl || profile?.avatarUrl;

  /**
   * handleAvatarChange
   *
   * BEHAVIORAL MECHANISM:
   * Generates a temporary local object URL for instant image preview in the UI,
   * activates the global loader, packages the selected File into a FormData container,
   * and dispatches it via updateProfileImage. Shows a success or error notification upon resolution.
   *
   * PARAMETERS:
   * - file (File): The image File object selected by the user from the file input picker.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleAvatarChange = useCallback(
    async (file: File) => {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setIsOpenLoader(true);

      const formData = new FormData();
      formData.append("poster", file);

      const { data: resData, error } = await updateProfileImage(formData);
      setIsOpenLoader(false);

      if (error || !resData) {
        showNotification(error || "Failed to upload avatar.", "error");
      } else {
        showNotification("Avatar updated successfully!", "success");
      }
    },
    [setIsOpenLoader, showNotification]
  );

  /**
   * onProfileSubmit
   *
   * BEHAVIORAL MECHANISM:
   * Formats the raw profile form inputs into a ProfileUpdationDto structure, triggers the loader,
   * and sends an asynchronous request to updateProfile. Displays a global notification toast
   * reflecting the operation status upon completion.
   *
   * PARAMETERS:
   * - formData (ProfileUpdationDto): The validated form field object emitted by ProfileForm.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onProfileSubmit = useCallback(
    async (formData: ProfileUpdationDto) => {
      if (!profile) return;
      setIsOpenLoader(true);

      const payload: ProfileUpdationDto = {
        id: profile.id,
        fullName: formData.fullName || "",
        programme: formData.programme ? String(formData.programme) : undefined,
        university: formData.university ? String(formData.university) : undefined,
        degree: formData.degree ? String(formData.degree) : undefined,
        facebook: formData.facebook || "",
        instagram: formData.instagram || "",
        linkedIn: formData.linkedIn || "",
        description: formData.description || "",
        age: Number(formData.age),
      };

      const { data: resData, error } = await updateProfile(payload);
      setIsOpenLoader(false);

      if (error || !resData) {
        showNotification(error || "Failed to update profile.", "error");
      } else {
        showNotification("Profile updated successfully!", "success");
      }
    },
    [profile, setIsOpenLoader, showNotification]
  );

  /**
   * handleAddLanguage
   *
   * BEHAVIORAL MECHANISM:
   * Sends an API request to createUserLanguage linking the specified language and proficiency level to the user.
   * On success, immutably appends the returned record to the userLangs state array so the UI updates without a page reload.
   *
   * PARAMETERS:
   * - langId (string): Unique identifier of the target language to add.
   * - proficiency ("BEGINNER" | "INTERMEDIATE" | "ADVANCED"): Selected proficiency level string.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleAddLanguage = useCallback(
    async (langId: string, proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => {
      if (!profile) return;

      setIsOpenLoader(true);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { data: created, error } = await createUserLanguage({
        userId: profile.id,
        languageId: langId,
        proficiency,
        timezone: userTimezone,
      });
      setIsOpenLoader(false);

      if (error || !created) {
        showNotification(error || "Failed to add language.", "error");
      } else {
        setUserLangs((prev) => [...prev, created]);
        showNotification("Language added successfully!", "success");
      }
    },
    [profile, setIsOpenLoader, showNotification]
  );

  /**
   * handleDeleteUserLanguage
   *
   * BEHAVIORAL MECHANISM:
   * Sends API request to deleteUserLanguage for the specified languageId.
   * On success, updates userLangs state immutably and displays success notification.
   */
  const handleDeleteUserLanguage = useCallback(
    async (languageId: string) => {
      setIsOpenLoader(true);
      const { error } = await deleteUserLanguage({ languageId });
      setIsOpenLoader(false);

      if (error) {
        showNotification(error || "Failed to delete user language.", "error");
      } else {
        setUserLangs((prev) => prev.filter((l) => l.languageId !== languageId));
        showNotification("User language deleted successfully!", "success");
      }
    },
    [setIsOpenLoader, showNotification]
  );

  /**
   * handleDateSelect
   *
   * BEHAVIORAL MECHANISM:
   * Captures start and end date objects emitted when the user selects or drags across a date range in FullCalendar.
   * Stores the selected range in selectedDateRange state and opens the CreateSlotModal dialog.
   *
   * PARAMETERS:
   * - selectInfo (DateSelectArg): The date selection event payload emitted by FullCalendar.
   *
   * RETURNS:
   * - void
   */
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedDateRange({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsSlotModalOpen(true);
  }, []);

  /**
   * handleEventClick
   *
   * BEHAVIORAL MECHANISM:
   * Extracts slot, isOwner, and status properties from the clicked FullCalendar event's extendedProps container.
   * Populates selectedSlotDetail state with this metadata, causing SlotDetailModal to animate into view.
   *
   * PARAMETERS:
   * - clickInfo (any): The event click payload object emitted by FullCalendar.
   *
   * RETURNS:
   * - void
   */
  const handleEventClick = useCallback((clickInfo: any) => {
    const slot = clickInfo.event.extendedProps?.slot as SlotUncheckedCreateInput;
    const isOwner = clickInfo.event.extendedProps?.isOwner as boolean;
    const status = clickInfo.event.extendedProps?.status as SlotStatus;

    if (slot) {
      setSelectedSlotDetail({ slot, isOwner, status });
    }
  }, []);

  /**
   * handleDeleteProvidedSlot
   *
   * BEHAVIORAL MECHANISM:
   * Reads the slot ID from selectedSlotDetail state, triggers loader, and invokes deleteUserSlot service.
   * Upon API success, filters out the deleted slot ID from provideSlots state and closes the slot detail modal.
   *
   * PARAMETERS:
   * None (accesses selectedSlotDetail state via closure).
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDeleteProvidedSlot = useCallback(async () => {
    if (!selectedSlotDetail) return;
    const slotId = selectedSlotDetail.slot.id;
    if (!slotId) return;
    setIsOpenLoader(true);
    const { error } = await deleteUserSlot({ slotId });
    setIsOpenLoader(false);

    if (error) {
      showNotification(error || "Failed to delete slot.", "error");
      return;
    }

    setProvideSlots((prev) => prev.filter((s) => s.id !== slotId));
    setSelectedSlotDetail(null);
    showNotification("Slot deleted successfully!", "success");
  }, [selectedSlotDetail, setIsOpenLoader, showNotification]);

  /**
   * handleGoToMeeting
   *
   * BEHAVIORAL MECHANISM:
   * Validates the presence of slotId and triggers programmatic navigation to the target meeting room route (/room/[slotId]).
   *
   * PARAMETERS:
   * - slotId (string): The room/slot identifier string.
   *
   * RETURNS:
   * - void
   */
  const handleGoToMeeting = useCallback(
    (slotId: string) => {
      if (!slotId) return;
      router.push(`/room/${slotId}`);
    },
    [router]
  );

  /**
   * onSlotSubmit
   *
   * BEHAVIORAL MECHANISM:
   * Validates target provide language selection, computes exact end time using selectedDateRange start time and duration,
   * and invokes the createSlot service API. On success, appends the newly created slot to provideSlots state and closes the modal.
   *
   * PARAMETERS:
   * - slotInput (SlotFormInput): Validated slot creation form inputs emitted by CreateSlotModal.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSlotSubmit = useCallback(
    async (slotInput: SlotFormInput) => {
      if (!profile || !selectedDateRange) return;

      if (!slotInput.provideLanguageId) {
        showNotification(
          "You must select a Provide Language with ADVANCED proficiency.",
          "error"
        );
        return;
      }

      setIsOpenLoader(true);

      const calculatedEndTime = new Date(
        selectedDateRange.start.getTime() + Number(slotInput.durationMinutes) * 60000
      );

      const slotPayload: SlotCreationDto = {
        title: slotInput.title,
        ownerId: profile.id,
        provideLanguageId: slotInput.provideLanguageId,
        exchangeLanguageId: slotInput.exchangeLanguageId,
        startTime: selectedDateRange.start,
        endTime: calculatedEndTime,
        durationMinutes: Number(slotInput.durationMinutes),
      };

      const { data: resData, error } = await createSlot(slotPayload);
      setIsOpenLoader(false);

      if (error || !resData) {
        showNotification(error || "Failed to create slot.", "error");
        return;
      }
      setProvideSlots((prev) => [...prev, resData]);
      setIsSlotModalOpen(false);
      showNotification("Slot created successfully!", "success");
    },
    [profile, selectedDateRange, setIsOpenLoader, showNotification]
  );

  /**
   * handleCloseSlotModal
   *
   * BEHAVIORAL MECHANISM:
   * Sets isSlotModalOpen state to false, causing CreateSlotModal to animate out of view.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleCloseSlotModal = useCallback(() => {
    setIsSlotModalOpen(false);
  }, []);

  /**
   * handleCloseDetailModal
   *
   * BEHAVIORAL MECHANISM:
   * Resets selectedSlotDetail state to null, causing SlotDetailModal to animate out of view.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleCloseDetailModal = useCallback(() => {
    setSelectedSlotDetail(null);
  }, []);

  return (
    <div className={`min-h-screen px-3 sm:px-6 lg:px-8 py-6 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${designTokens.colors.border.default} pb-6`}
        >
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
              User Dashboard
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${designTokens.colors.text.secondary}`}>
              Manage your personal profile information, languages, and scheduled slots
            </p>
          </div>
        </motion.div>

        {/* Profile Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
        >
          <div className={`flex flex-col gap-1 border-b ${designTokens.colors.border.default} pb-4`}>
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              Edit Profile
            </h2>
            <p className={`text-xs ${designTokens.colors.text.muted}`}>
              Update your avatar and public information
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 pt-2">
            {/* Avatar Column (Left) */}
            <AvatarUploader
              displayAvatar={displayAvatar || null}
              initials={profile?.fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
              isLoading={isOpenLoader}
              onChange={handleAvatarChange}
            />

            {/* Profile Form Column (Right) */}
            <div className="flex-1 w-full">
              <ProfileForm
                profile={profile}
                isLoading={isOpenLoader}
                onSubmit={onProfileSubmit}
              />
            </div>
          </div>
        </motion.div>

        {/* User Languages Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
        >
          <UserLanguagesSection
            userLangs={userLangs}
            allLanguages={allLanguages}
            isLoading={isOpenLoader}
            onAddLanguage={handleAddLanguage}
            onDeleteLanguage={handleDeleteUserLanguage}
          />
        </motion.div>

        {/* Booked Slots Grid Section (Above Calendar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
        >
          <BookedSlotsSection
            bookedSlots={allBookedSlots}
            allLanguages={allLanguages}
            onSelectSlot={(detail) => setSelectedSlotDetail(detail)}
          />
        </motion.div>

        {/* FullCalendar Slots Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
        >
          <SlotCalendar
            events={calendarEvents}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        </motion.div>

      </div>

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={isSlotModalOpen}
        isLoading={isOpenLoader}
        selectedDateRange={selectedDateRange}
        provideLanguageOptions={provideLanguageOptions}
        allLanguages={allLanguages}
        defaultProvideLanguageId={provideLanguageOptions[0]?.id || ""}
        defaultExchangeLanguageId={allLanguages[0]?.id || ""}
        onClose={handleCloseSlotModal}
        onSubmit={onSlotSubmit}
      />

      {/* Slot Details Modal */}
      <SlotDetailModal
        detail={selectedSlotDetail}
        allLanguages={allLanguages}
        isLoading={isOpenLoader}
        onClose={handleCloseDetailModal}
        onDelete={handleDeleteProvidedSlot}
        onGoToMeeting={handleGoToMeeting}
      />
    </div>
  );
}
