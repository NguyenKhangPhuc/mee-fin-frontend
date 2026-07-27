"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { ProfileUpdationDto } from "@/app/types/profile";
import { SlotCreationDto } from "@/app/types/slot";
import { SlotStatus } from "@/app/types/enum";
import { LanguageUncheckedCreateInput, UserLanguageUncheckedCreateInput, SlotUncheckedCreateInput, ProfileUncheckedCreateInput } from "@/app/types";
import { updateProfile, updateProfileImage } from "@/app/services/profile";
import { createSlot } from "@/app/services/slots";
import { deleteUserSlot } from "@/app/services/slots/delete-user-slot";
import { createUserLanguage } from "@/app/services/user-language";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

interface DateSelectArg {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
}

interface UserDashboardClientProps {
  profile: ProfileUncheckedCreateInput | null;
  allLanguages?: LanguageUncheckedCreateInput[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    slot: SlotUncheckedCreateInput;
    isOwner: boolean;
    status: SlotStatus;
  };
}

interface SlotFormInput {
  title: string;
  provideLanguageId: string;
  exchangeLanguageId: string;
  durationMinutes: number;
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

  const [selectedAddLangId, setSelectedAddLangId] = useState<string>("");
  const [selectedProficiency, setSelectedProficiency] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [selectedSlotDetail, setSelectedSlotDetail] = useState<{
    slot: SlotUncheckedCreateInput;
    isOwner: boolean;
    status: SlotStatus;
  } | null>(null);

  // Map provided and exchanged slots to FullCalendar events by status & ownership
  const getCalendarEvents = (): CalendarEvent[] => {
    const allSlotsMap = new Map<string, { slot: SlotUncheckedCreateInput; isOwner: boolean }>();

    (provideSlots || []).forEach((s) => {
      if (s.id) allSlotsMap.set(s.id, { slot: s, isOwner: true });
    });

    (exchangeSlots || []).forEach((s) => {
      if (s.id && !allSlotsMap.has(s.id)) {
        allSlotsMap.set(s.id, { slot: s, isOwner: false });
      }
    });

    const events: CalendarEvent[] = [];

    allSlotsMap.forEach(({ slot, isOwner }) => {
      const startTime = new Date(slot.startTime);
      const endTime = slot.endTime
        ? new Date(slot.endTime)
        : new Date(startTime.getTime() + (slot.durationMinutes || 30) * 60000);

      const status = (slot.status as SlotStatus) || (slot.exchangeUserId ? SlotStatus.BOOKED : SlotStatus.OPEN);

      let backgroundColor = "#10b981"; // GREEN for OPEN
      let borderColor = "#059669";

      if (status === SlotStatus.BOOKED) {
        backgroundColor = "#ef4444"; // RED for BOOKED
        borderColor = "#dc2626";
      } else if (status === SlotStatus.COMPLETED) {
        backgroundColor = "#3b82f6"; // BLUE for COMPLETED
        borderColor = "#2563eb";
      } else if (status === SlotStatus.CANCELLED) {
        backgroundColor = "#6b7280"; // GRAY for CANCELLED
        borderColor = "#4b5563";
      }

      events.push({
        id: slot.id || String(Date.now()),
        title: `${slot.title} (${status})`,
        start: startTime,
        end: endTime,
        backgroundColor,
        borderColor,
        textColor: "#ffffff",
        extendedProps: {
          slot,
          isOwner,
          status,
        },
      });
    });

    return events;
  };

  const calendarEvents = getCalendarEvents();

  // Unadded languages filter
  const unaddedLanguages = allLanguages.filter(
    (lang) => lang.id && !userLangs.some((ul) => ul.languageId === lang.id)
  );

  // Advanced user languages (required for Provide Language)
  const advancedUserLangs = userLangs.filter((ul) => ul.proficiency === "ADVANCED");
  const provideLanguageOptions = advancedUserLangs
    .map((ul) => {
      const langObj = allLanguages.find((l) => l.id === ul.languageId);
      return langObj && langObj.id ? { id: langObj.id, name: langObj.name } : null;
    })
    .filter(Boolean) as { id: string; name: string }[];

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdationDto>({
    defaultValues: {
      id: profile?.id || "",
      fullName: profile?.fullName || "",
      age: profile?.age || 20,
      programme: profile?.programme || "",
      university: profile?.university || "",
      degree: profile?.degree || "",
      instagram: profile?.instagram || "",
      facebook: profile?.facebook || "",
      linkedIn: profile?.linkedIn || "",
      description: profile?.description || "",
    },
  });

  const {
    register: registerSlot,
    handleSubmit: handleSlotSubmit,
    reset: resetSlotForm,
    setValue: setSlotValue,
    formState: { errors: slotErrors },
  } = useForm<SlotFormInput>({
    defaultValues: {
      title: "Language Exchange Slot",
      provideLanguageId: "",
      exchangeLanguageId: "",
      durationMinutes: 30,
    },
  });

  // Handlers
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  };

  const onProfileSubmit = async (formData: ProfileUpdationDto) => {
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
  };

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedAddLangId) return;

    setIsOpenLoader(true);
    const { data: created, error } = await createUserLanguage({
      userId: profile.id,
      languageId: selectedAddLangId,
      proficiency: selectedProficiency,
    });
    setIsOpenLoader(false);

    if (error || !created) {
      showNotification(error || "Failed to add language.", "error");
    } else {
      setUserLangs((prev) => [...prev, created]);
      setSelectedAddLangId("");
      showNotification("Language added successfully!", "success");
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateRange({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    if (provideLanguageOptions.length > 0) {
      setSlotValue("provideLanguageId", provideLanguageOptions[0].id);
    }
    if (allLanguages.length > 0 && allLanguages[0].id) {
      setSlotValue("exchangeLanguageId", allLanguages[0].id);
    }
    setIsSlotModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const slot = clickInfo.event.extendedProps?.slot as SlotUncheckedCreateInput;
    const isOwner = clickInfo.event.extendedProps?.isOwner as boolean;
    const status = clickInfo.event.extendedProps?.status as SlotStatus;

    if (slot) {
      setSelectedSlotDetail({ slot, isOwner, status });
    }
  };

  const handleDeleteProvidedSlot = async () => {
    if (!selectedSlotDetail) return;
    console.log("This is selectedSlotDetail " + selectedSlotDetail.slot.durationMinutes)
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
  };

  // Check if meeting button is available (5 mins before start until end time)
  const checkIsMeetingAvailable = (slot: SlotUncheckedCreateInput): boolean => {
    if (!slot.startTime) return false;
    const now = new Date().getTime();
    const startTimeMs = new Date(slot.startTime).getTime();
    const endTimeMs = slot.endTime
      ? new Date(slot.endTime).getTime()
      : startTimeMs + (slot.durationMinutes || 30) * 60000;

    return now >= startTimeMs - 5 * 60 * 1000 && now <= endTimeMs;
  };

  const handleGoToMeeting = (slotId: string) => {
    if (!slotId) return;
    router.push(`/room/${slotId}`);
  };

  const onSlotSubmit = async (slotInput: SlotFormInput) => {
    if (!profile || !selectedDateRange) return;

    if (!slotInput.provideLanguageId) {
      showNotification("You must select a Provide Language with ADVANCED proficiency.", "error");
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
    console.log("This is the result data " + resData)
    setProvideSlots((prev) => [...prev, resData]);
    setIsSlotModalOpen(false);
    resetSlotForm();
    showNotification("Slot created successfully!", "success");
  };

  const getProficiencyBadgeStyle = (prof: string) => {
    switch (prof) {
      case "ADVANCED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "INTERMEDIATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getStatusBadgeStyle = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.OPEN:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case SlotStatus.BOOKED:
        return "bg-rose-100 text-rose-800 border-rose-200";
      case SlotStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case SlotStatus.CANCELLED:
        return "bg-neutral-200 text-neutral-800 border-neutral-300";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const displayAvatar = avatarPreview || profile?.publicAvatarUrl || profile?.avatarUrl;

  return (
    <div className={`min-h-screen p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className={`text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            User Dashboard
          </h1>
          <p className={`text-sm ${designTokens.colors.text.secondary}`}>
            Manage your personal profile information, languages, and scheduled slots
          </p>
        </div>

        {/* Profile Card Section */}
        <div className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-8`}>
          <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              Edit Profile
            </h2>
            <p className={`text-xs ${designTokens.colors.text.muted}`}>
              Update your avatar and public information
            </p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-100">
            <div className="relative w-24 h-24 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-300 shrink-0">
              {displayAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-neutral-600 uppercase">
                  {profile?.fullName?.charAt(0) || profile?.email?.charAt(0) || "U"}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-start gap-2">
              <label className={`px-4 py-2 text-sm font-medium ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} cursor-pointer hover:bg-neutral-100 transition shadow-xs`}>
                Upload New Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isOpenLoader}
                />
              </label>
              <span className={`text-xs ${designTokens.colors.text.muted}`}>
                JPG, PNG or GIF. Max 5MB.
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className={`h-11 px-3.5 border ${profileErrors.fullName ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("fullName", { required: "Full name is required" })}
                />
                {profileErrors.fullName && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email (Disabled) */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className={`h-11 px-3.5 border border-neutral-200 ${designTokens.radii.input} bg-neutral-100 text-neutral-500 cursor-not-allowed text-sm`}
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter age"
                  className={`h-11 px-3.5 border ${profileErrors.age ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("age", {
                    required: "Age is required",
                    min: { value: 1, message: "Age must be positive" },
                  })}
                />
                {profileErrors.age && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {profileErrors.age.message}
                  </p>
                )}
              </div>

              {/* Programme */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Programme
                </label>
                <input
                  type="text"
                  placeholder="Enter programme"
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("programme")}
                />
              </div>

              {/* University */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  University
                </label>
                <input
                  type="text"
                  placeholder="Enter university"
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("university")}
                />
              </div>

              {/* Degree */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Degree
                </label>
                <input
                  type="text"
                  placeholder="Enter degree"
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("degree")}
                />
              </div>

              {/* Instagram Link */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Instagram Profile Link
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("instagram")}
                />
              </div>

              {/* Facebook Link */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Facebook Profile Link
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("facebook")}
                />
              </div>

              {/* LinkedIn Link */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  LinkedIn Profile Link
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("linkedIn")}
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                Short Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell us a little bit about yourself..."
                className={`p-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm resize-y`}
                {...registerProfile("description")}
              />
            </div>

            <button
              type="submit"
              disabled={isOpenLoader}
              className={`self-end px-6 h-11 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 text-sm`}
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* User Languages Section */}
        <div className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>
          <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              User Languages
            </h2>
            <p className={`text-xs ${designTokens.colors.text.muted}`}>
              Manage the languages you speak and your proficiency levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Languages */}
            <div className="flex flex-col gap-4">
              <h3 className={`text-sm font-bold uppercase tracking-wider text-neutral-500`}>
                My Current Languages ({userLangs.length})
              </h3>
              {userLangs.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No languages added yet.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {userLangs.map((ul) => {
                    const langObj = allLanguages.find((l) => l.id === ul.languageId);
                    return (
                      <div
                        key={ul.id || ul.languageId}
                        className="flex items-center justify-between p-3.5 border border-neutral-200 rounded-xl bg-neutral-50/50"
                      >
                        <span className="font-semibold text-sm text-neutral-900">
                          {langObj ? langObj.name : `Language (${ul.languageId})`}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getProficiencyBadgeStyle(
                            ul.proficiency
                          )}`}
                        >
                          {ul.proficiency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Add Language Form */}
            <form onSubmit={handleAddLanguage} className="flex flex-col gap-4 bg-neutral-50/50 p-5 border border-neutral-200 rounded-xl">
              <h3 className={`text-sm font-bold uppercase tracking-wider text-neutral-700`}>
                Add New Language
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Select Available Language
                </label>
                <select
                  value={selectedAddLangId}
                  onChange={(e) => setSelectedAddLangId(e.target.value)}
                  className={`h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
                >
                  <option value="">-- Choose a language --</option>
                  {unaddedLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Proficiency Level
                </label>
                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value as any)}
                  className={`h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!selectedAddLangId || isOpenLoader}
                className={`mt-2 h-10 px-4 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-medium transition cursor-pointer disabled:opacity-50`}
              >
                Add Language
              </button>
            </form>
          </div>
        </div>

        {/* FullCalendar Slots Section */}
        <div className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
                Manage Slots Calendar
              </h2>
              <p className={`text-xs ${designTokens.colors.text.muted}`}>
                Click or drag on dates/times to schedule a new slot. Click existing slots for details & actions.
              </p>
            </div>

            {/* Calendar Status Legend */}
            <div className="flex flex-wrap items-center gap-3.5 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#10b981]" />
                <span className="text-neutral-700">OPEN (Green)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#ef4444]" />
                <span className="text-neutral-700">BOOKED (Red)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#3b82f6]" />
                <span className="text-neutral-700">COMPLETED (Blue)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#6b7280]" />
                <span className="text-neutral-700">CANCELLED (Gray)</span>
              </div>
            </div>
          </div>

          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={calendarEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
            />
          </div>
        </div>
      </div>

      {/* Create Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md bg-white p-6 ${designTokens.radii.card} shadow-2xl flex flex-col gap-4 border ${designTokens.colors.border.default}`}>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                Create Slot
              </h3>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSlotSubmit(onSlotSubmit)} className="flex flex-col gap-4">
              {/* Slot Title */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Slot Title
                </label>
                <input
                  type="text"
                  placeholder="Slot Title"
                  className={`h-10 px-3 border ${slotErrors.title ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.border.focus}`}
                  {...registerSlot("title", { required: "Title is required" })}
                />
                {slotErrors.title && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {slotErrors.title.message}
                  </p>
                )}
              </div>

              {/* Provide Language Dropdown (ADVANCED Only) */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Provide Language (ADVANCED proficiency required)
                </label>
                {provideLanguageOptions.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
                    ⚠️ You don&apos;t have any language with <strong>ADVANCED</strong> proficiency. Add an ADVANCED language in your profile to provide slots.
                  </div>
                ) : (
                  <select
                    className={`h-10 px-3 border ${slotErrors.provideLanguageId ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none bg-white ${designTokens.colors.border.focus}`}
                    {...registerSlot("provideLanguageId", { required: "Provide language is required" })}
                  >
                    {provideLanguageOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Exchange Language Dropdown (All Languages) */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Exchange Language (Target language to learn)
                </label>
                <select
                  className={`h-10 px-3 border ${slotErrors.exchangeLanguageId ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none bg-white ${designTokens.colors.border.focus}`}
                  {...registerSlot("exchangeLanguageId", { required: "Exchange language is required" })}
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Minutes */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Duration (Minutes: 15-30)
                </label>
                <input
                  type="number"
                  className={`h-10 px-3 border ${slotErrors.durationMinutes ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.border.focus}`}
                  {...registerSlot("durationMinutes", {
                    required: "Duration is required",
                    min: { value: 15, message: "Duration must be at least 15 minutes" },
                    max: { value: 30, message: "Duration must be at most 30 minutes" },
                  })}
                />
                {slotErrors.durationMinutes && (
                  <p className="text-xs text-red-500 font-medium">
                    {slotErrors.durationMinutes.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className={`px-4 h-10 border ${designTokens.colors.border.default} ${designTokens.radii.button} text-xs font-medium text-neutral-700 hover:bg-neutral-100`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOpenLoader || provideLanguageOptions.length === 0}
                  className={`px-4 h-10 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-medium disabled:opacity-50`}
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Details Modal */}
      {selectedSlotDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6 select-none animate-in zoom-in-95 duration-200`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    SLOT_DETAILS
                  </span>
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${getStatusBadgeStyle(
                      selectedSlotDetail.status
                    )}`}
                  >
                    {selectedSlotDetail.status}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
                  {selectedSlotDetail.slot.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotDetail(null)}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shrink-0 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Read-only Slot Info */}
            <div className="flex flex-col gap-3.5 bg-neutral-50/80 p-4 rounded-xl border border-neutral-100">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>My Role</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${selectedSlotDetail.isOwner
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}
                >
                  {selectedSlotDetail.isOwner ? "Host / Owner (Provided)" : "Participant (Exchanged)"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Slot Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getStatusBadgeStyle(
                    selectedSlotDetail.status
                  )}`}
                >
                  {selectedSlotDetail.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Start Time</span>
                <span className="text-xs font-medium text-neutral-700 text-right">
                  {new Date(selectedSlotDetail.slot.startTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>End Time</span>
                <span className="text-xs font-medium text-neutral-700 text-right">
                  {new Date(selectedSlotDetail.slot.endTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Duration</span>
                <span className="text-xs font-bold text-neutral-800">
                  {selectedSlotDetail.slot.durationMinutes} mins
                </span>
              </div>

              {selectedSlotDetail.slot.id && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Room ID</span>
                  <span className="font-mono text-[11px] text-neutral-600 truncate max-w-[180px]">
                    {selectedSlotDetail.slot.id}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons based on SlotStatus */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlotDetail(null)}
                className={`px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
              >
                Close
              </button>

              {/* Status OPEN -> Delete Button */}
              {selectedSlotDetail.status === SlotStatus.OPEN && (
                <button
                  type="button"
                  onClick={handleDeleteProvidedSlot}
                  disabled={isOpenLoader}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Slot
                </button>
              )}

              {/* Status BOOKED -> Go to meeting Button */}
              {selectedSlotDetail.status === SlotStatus.BOOKED && (
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    disabled={!checkIsMeetingAvailable(selectedSlotDetail.slot)}
                    onClick={() => handleGoToMeeting(selectedSlotDetail.slot.id!)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Go to the meeting
                  </button>
                  {!checkIsMeetingAvailable(selectedSlotDetail.slot) && (
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Available 5 mins before start time
                    </span>
                  )}
                </div>
              )}

              {/* Status COMPLETED or CANCELLED -> No extra action button */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
