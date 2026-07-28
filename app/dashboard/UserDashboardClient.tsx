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
import { createUserLanguage } from "@/app/services/user-language";
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

interface UserDashboardClientProps {
  profile: ProfileUncheckedCreateInput | null;
  allLanguages?: LanguageUncheckedCreateInput[];
}

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

  // CRITICAL PERFORMANCE FIX: Memoize calendarEvents so FullCalendar doesn't destroy and rebuild DOM on every render!
  const calendarEvents = useMemo(
    () => buildCalendarEvents(provideSlots, exchangeSlots),
    [provideSlots, exchangeSlots]
  );

  const displayAvatar = avatarPreview || profile?.publicAvatarUrl || profile?.avatarUrl;

  // Handlers — memoized with useCallback
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

  const handleAddLanguage = useCallback(
    async (langId: string, proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => {
      if (!profile) return;

      setIsOpenLoader(true);
      const { data: created, error } = await createUserLanguage({
        userId: profile.id,
        languageId: langId,
        proficiency,
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

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedDateRange({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsSlotModalOpen(true);
  }, []);

  const handleEventClick = useCallback((clickInfo: any) => {
    const slot = clickInfo.event.extendedProps?.slot as SlotUncheckedCreateInput;
    const isOwner = clickInfo.event.extendedProps?.isOwner as boolean;
    const status = clickInfo.event.extendedProps?.status as SlotStatus;

    if (slot) {
      setSelectedSlotDetail({ slot, isOwner, status });
    }
  }, []);

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

  const handleGoToMeeting = useCallback(
    (slotId: string) => {
      if (!slotId) return;
      router.push(`/room/${slotId}`);
    },
    [router]
  );

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

  const handleCloseSlotModal = useCallback(() => {
    setIsSlotModalOpen(false);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedSlotDetail(null);
  }, []);

  return (
    <div className={`min-h-screen p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-1"
        >
          <h1 className={`text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            User Dashboard
          </h1>
          <p className={`text-sm ${designTokens.colors.text.secondary}`}>
            Manage your personal profile information, languages, and scheduled slots
          </p>
        </motion.div>

        {/* Profile Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-8`}
        >
          <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              Edit Profile
            </h2>
            <p className={`text-xs ${designTokens.colors.text.muted}`}>
              Update your avatar and public information
            </p>
          </div>
          <AvatarUploader
            displayAvatar={displayAvatar || null}
            initials={profile?.fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
            isLoading={isOpenLoader}
            onChange={handleAvatarChange}
          />
          <ProfileForm
            profile={profile}
            isLoading={isOpenLoader}
            onSubmit={onProfileSubmit}
          />
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
        isLoading={isOpenLoader}
        onClose={handleCloseDetailModal}
        onDelete={handleDeleteProvidedSlot}
        onGoToMeeting={handleGoToMeeting}
      />
    </div>
  );
}
