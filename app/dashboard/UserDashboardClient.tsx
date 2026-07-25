"use client";

import React, { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface DateSelectArg {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
}

interface EventClickArg {
  event: {
    id: string;
    title: string;
    remove: () => void;
  };
}
import { SafeUser } from "@/app/types/authentication";
import { ProfileUpdationDto } from "@/app/types/profile";
import { SlotCreationDto } from "@/app/types/slot";
import { updateProfile, updateProfileImage } from "@/app/services/profile";
import { createSlot } from "@/app/services/slots";
import { designTokens } from "@/app/constants/design-tokens";

interface UserDashboardClientProps {
  user: SafeUser | null;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
}

interface SlotFormInput {
  title: string;
  provideLanguageId: string;
  exchangeLanguageId: string;
  roomId: string;
  durationMinutes: number;
}

export default function UserDashboardClient({ user }: UserDashboardClientProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false);
  const [avatarMessage, setAvatarMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [isProfileUpdating, setIsProfileUpdating] = useState<boolean>(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [isSlotCreating, setIsSlotCreating] = useState<boolean>(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdationDto>({
    defaultValues: {
      id: user?.id || "",
      fullName: user?.displayName || "",
      companyName: "",
      age: 20,
      programme: "",
      university: "",
      degree: "",
      instagram: "",
      facebook: "",
      linkedIn: "",
      description: "",
    },
  });

  const {
    register: registerSlot,
    handleSubmit: handleSlotSubmit,
    reset: resetSlotForm,
    formState: { errors: slotErrors },
  } = useForm<SlotFormInput>({
    defaultValues: {
      title: "Language Exchange Slot",
      provideLanguageId: "00000000-0000-0000-0000-000000000001",
      exchangeLanguageId: "00000000-0000-0000-0000-000000000002",
      roomId: "00000000-0000-0000-0000-000000000003",
      durationMinutes: 30,
    },
  });

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setIsAvatarUploading(true);
    setAvatarMessage(null);

    const formData = new FormData();
    formData.append("poster", file);

    const { data: resData, error } = await updateProfileImage(formData);

    if (error || !resData) {
      setAvatarMessage({
        text: error?.response?.data?.message || "Failed to upload avatar.",
        type: "error",
      });
    } else {
      setAvatarMessage({
        text: "Avatar updated successfully!",
        type: "success",
      });
    }
    setIsAvatarUploading(false);
  };

  const onProfileSubmit = async (formData: ProfileUpdationDto) => {
    if (!user) return;
    setIsProfileUpdating(true);
    setProfileMessage(null);

    const payload: ProfileUpdationDto = {
      ...formData,
      id: user.id,
      age: Number(formData.age),
    };

    const { data: resData, error } = await updateProfile(payload);

    if (error || !resData) {
      setProfileMessage({
        text: error?.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } else {
      setProfileMessage({
        text: "Profile updated successfully!",
        type: "success",
      });
    }
    setIsProfileUpdating(false);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDateRange({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setSlotError(null);
    setIsSlotModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Delete slot '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  };

  const onSlotSubmit = async (slotInput: SlotFormInput) => {
    if (!user || !selectedDateRange) return;
    setIsSlotCreating(true);
    setSlotError(null);

    const slotPayload: SlotCreationDto = {
      title: slotInput.title,
      ownerId: user.id,
      provideLanguageId: slotInput.provideLanguageId,
      exchangeLanguageId: slotInput.exchangeLanguageId,
      startTime: selectedDateRange.start,
      endTime: selectedDateRange.end,
      roomId: slotInput.roomId,
      durationMinutes: Number(slotInput.durationMinutes),
    };

    const { data: resData, error } = await createSlot(slotPayload);

    if (error || !resData) {
      setSlotError(error?.response?.data?.message || "Failed to create slot.");
      setIsSlotCreating(false);
      return;
    }

    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title: slotInput.title,
      start: selectedDateRange.start,
      end: selectedDateRange.end,
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsSlotModalOpen(false);
    resetSlotForm();
    setIsSlotCreating(false);
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className={`text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            User Dashboard
          </h1>
          <p className={`text-sm ${designTokens.colors.text.secondary}`}>
            Manage your personal profile information and scheduled slots
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
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-neutral-600 uppercase">
                  {user?.displayName?.charAt(0) || user?.email.charAt(0) || "U"}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-start gap-2">
              <label className={`px-4 py-2 text-sm font-medium ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} cursor-pointer hover:bg-neutral-100 transition shadow-xs`}>
                {isAvatarUploading ? "Uploading..." : "Upload New Avatar"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isAvatarUploading}
                />
              </label>
              <span className={`text-xs ${designTokens.colors.text.muted}`}>
                JPG, PNG or GIF. Max 5MB.
              </span>
              {avatarMessage && (
                <p className={`text-xs font-medium ${avatarMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {avatarMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-6">
            {profileMessage && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${profileMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {profileMessage.text}
              </div>
            )}

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
                  value={user?.email || ""}
                  disabled
                  className={`h-11 px-3.5 border border-neutral-200 ${designTokens.radii.input} bg-neutral-100 text-neutral-500 cursor-not-allowed text-sm`}
                />
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
                  {...registerProfile("companyName")}
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
              disabled={isProfileUpdating}
              className={`self-end px-6 h-11 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 text-sm`}
            >
              {isProfileUpdating ? "Saving..." : "Save Profile Changes"}
            </button>
          </form>
        </div>

        {/* FullCalendar Slots Section */}
        <div className={`p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>
          <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              Manage Slots Calendar
            </h2>
            <p className={`text-xs ${designTokens.colors.text.muted}`}>
              Click or drag on dates/times in the calendar to schedule a new slot
            </p>
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
              events={events}
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

            {slotError && (
              <div className="p-3 text-xs rounded-xl bg-red-50 text-red-600 border border-red-200">
                {slotError}
              </div>
            )}

            <form onSubmit={handleSlotSubmit(onSlotSubmit)} className="flex flex-col gap-4">
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

              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Duration (Minutes: 15-60)
                </label>
                <input
                  type="number"
                  className={`h-10 px-3 border ${slotErrors.durationMinutes ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.border.focus}`}
                  {...registerSlot("durationMinutes", {
                    required: "Duration is required",
                    min: { value: 15, message: "Min 15 minutes" },
                    max: { value: 60, message: "Max 60 minutes" },
                  })}
                />
              </div>

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
                  disabled={isSlotCreating}
                  className={`px-4 h-10 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-medium disabled:opacity-50`}
                >
                  {isSlotCreating ? "Creating..." : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
