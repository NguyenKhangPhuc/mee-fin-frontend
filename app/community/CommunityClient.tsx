"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { SafeUser } from "@/app/types/authentication";
import { ProfileUncheckedCreateInput, SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { bookUserSlot } from "@/app/services/slots/book-user-slot";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

interface CommunityClientProps {
  currentUser?: SafeUser | null;
  profiles: ProfileUncheckedCreateInput[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    isBooked: boolean;
    durationMinutes?: number;
  };
}

export default function CommunityClient({ currentUser, profiles }: CommunityClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  const [profilesList, setProfilesList] = useState<ProfileUncheckedCreateInput[]>(profiles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    profiles[0]?.id || ""
  );
  const [selectedSlotToBook, setSelectedSlotToBook] = useState<SlotUncheckedCreateInput | null>(null);

  // Filter profiles based on search query
  const filteredProfiles = profilesList.filter((p) => {
    const q = searchQuery.toLowerCase();
    const name = p.fullName?.toLowerCase() || "";
    const email = p.email?.toLowerCase() || "";
    const uni = p.university?.toLowerCase() || "";
    const prog = p.programme?.toLowerCase() || "";
    return name.includes(q) || email.includes(q) || uni.includes(q) || prog.includes(q);
  });

  const selectedProfile =
    profilesList.find((p) => p.id === selectedProfileId) || profilesList[0] || null;

  // Map provided slots of selected user to FullCalendar events
  const getEventsForProfile = (profile: ProfileUncheckedCreateInput | null): CalendarEvent[] => {
    if (!profile || !profile.provideSlots) return [];

    return profile.provideSlots.map((slot: SlotUncheckedCreateInput) => {
      const startTime = new Date(slot.startTime);
      const endTime = slot.endTime
        ? new Date(slot.endTime)
        : new Date(startTime.getTime() + (slot.durationMinutes || 30) * 60000);

      // Check if slot is occupied/booked
      const isBooked = Boolean(
        slot.exchangeUserId ||
        (slot as any).status === "BOOKED" ||
        (slot as any).isBooked
      );

      return {
        id: slot.id || String(Date.now()),
        title: `${slot.title} ${isBooked ? "(Booked)" : "(Available)"}`,
        start: startTime,
        end: endTime,
        // Red (#ef4444) for occupied/booked slots, Theme Accent (#0284c7) for available slots
        backgroundColor: isBooked ? "#ef4444" : "#0284c7",
        borderColor: isBooked ? "#dc2626" : "#0369a1",
        textColor: "#ffffff",
        extendedProps: {
          isBooked,
          durationMinutes: slot.durationMinutes,
        },
      };
    });
  };

  const calendarEvents = getEventsForProfile(selectedProfile);

  const handleEventClick = (clickInfo: any) => {
    const isBooked = clickInfo.event.extendedProps?.isBooked;
    const slotId = clickInfo.event.id;

    if (isBooked) {
      showNotification("This slot has already been booked.", "info");
      return;
    }

    if (!selectedProfile || !selectedProfile.provideSlots) return;

    const slot = selectedProfile.provideSlots.find((s) => s.id === slotId);
    if (slot) {
      setSelectedSlotToBook(slot);
    }
  };

  const handleConfirmBook = async () => {
    if (!selectedSlotToBook) return;
    if (!currentUser?.id) {
      showNotification("You must be logged in to book a slot.", "error");
      return;
    }

    setIsOpenLoader(true);
    const { error } = await bookUserSlot({
      slotId: selectedSlotToBook.id!,
      exchangeUserId: currentUser.id,
    });
    setIsOpenLoader(false);

    if (error) {
      showNotification(error || "Failed to book slot", "error");
      return;
    }

    // Update profilesList local state so the slot becomes booked
    setProfilesList((prevProfiles) =>
      prevProfiles.map((p) => {
        if (p.id !== selectedProfile?.id) return p;
        return {
          ...p,
          provideSlots: (p.provideSlots || []).map((s) => {
            if (s.id === selectedSlotToBook.id) {
              return {
                ...s,
                exchangeUserId: currentUser.id,
                status: "BOOKED" as any,
              };
            }
            return s;
          }),
        };
      })
    );

    setSelectedSlotToBook(null);
    showNotification("Slot booked successfully!", "success");
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
              Community Members
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${designTokens.colors.text.secondary}`}>
              Explore member profiles, academic details, and their available language exchange schedules
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 pl-9 pr-4 text-xs sm:text-sm border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} bg-white transition shadow-xs`}
            />
            <svg
              className="w-4 h-4 absolute left-3 top-3 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Main Content Layout */}
        {profilesList.length === 0 ? (
          <div className={`p-12 text-center ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default}`}>
            <p className={`text-sm ${designTokens.colors.text.secondary}`}>No community members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Members Directory Column (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted} px-1`}>
                Members ({filteredProfiles.length})
              </span>

              <div className="flex flex-col gap-2.5 max-h-[680px] overflow-y-auto pr-1">
                {filteredProfiles.map((p) => {
                  const isSelected = selectedProfile?.id === p.id;
                  const avatar = p.publicAvatarUrl || p.avatarUrl;
                  const slotCount = p.provideSlots?.length || 0;

                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfileId(p.id)}
                      type="button"
                      className={`w-full text-left p-4 ${designTokens.radii.card} border transition-all flex items-center gap-3.5 cursor-pointer ${isSelected
                        ? "bg-sky-50/70 border-sky-500 shadow-sm ring-1 ring-sky-500/20"
                        : `${designTokens.colors.bg.card} ${designTokens.colors.border.default} hover:bg-neutral-50`
                        }`}
                    >
                      {/* Member Avatar */}
                      <div className="relative w-11 h-11 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border border-neutral-300 shrink-0">
                        {avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatar} alt={p.fullName || "User Avatar"} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-neutral-600 uppercase">
                            {p.fullName?.charAt(0) || p.email?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className={`text-sm font-semibold truncate ${designTokens.colors.text.primary}`}>
                          {p.fullName || "Unnamed Member"}
                        </span>
                        <span className={`text-xs truncate ${designTokens.colors.text.muted}`}>
                          {p.university || p.email}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                            {slotCount} {slotCount === 1 ? "slot" : "slots"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected User Details & Schedule Calendar Column (Right) */}
            {selectedProfile && (
              <div className="lg:col-span-8 flex flex-col gap-6">

                {/* Profile Header Banner Card */}
                <div className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>

                  {/* Top Profile Summary */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-neutral-100">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-300 shrink-0 shadow-sm">
                      {selectedProfile.publicAvatarUrl || selectedProfile.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedProfile.publicAvatarUrl || selectedProfile.avatarUrl || ""}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl sm:text-3xl font-bold text-neutral-600 uppercase">
                          {selectedProfile.fullName?.charAt(0) || selectedProfile.email?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className={`text-xl sm:text-2xl font-bold ${designTokens.colors.text.primary}`}>
                          {selectedProfile.fullName || "Unnamed Member"}
                        </h2>
                        {selectedProfile.age && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {selectedProfile.age} yrs
                          </span>
                        )}
                      </div>
                      <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary}`}>
                        {selectedProfile.email}
                      </p>

                      {/* Social Media Links */}
                      <div className="flex items-center gap-3 mt-2">
                        {selectedProfile.facebook && (
                          <a
                            href={selectedProfile.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                          >
                            Facebook
                          </a>
                        )}
                        {selectedProfile.instagram && (
                          <a
                            href={selectedProfile.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-pink-600 hover:underline font-medium flex items-center gap-1"
                          >
                            Instagram
                          </a>
                        )}
                        {selectedProfile.linkedIn && (
                          <a
                            href={selectedProfile.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-sky-700 hover:underline font-medium flex items-center gap-1"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Academic & Bio Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
                        University
                      </span>
                      <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
                        {selectedProfile.university || "Not provided"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
                        Programme
                      </span>
                      <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
                        {selectedProfile.programme || "Not provided"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
                        Degree
                      </span>
                      <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
                        {selectedProfile.degree || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* Description / Bio */}
                  {selectedProfile.description && (
                    <div className="flex flex-col gap-1 pt-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
                        About
                      </span>
                      <p className={`text-xs leading-relaxed ${designTokens.colors.text.secondary} bg-neutral-50/60 p-3.5 rounded-lg border border-neutral-100`}>
                        {selectedProfile.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Member Calendar Schedule Card */}
                <div className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>

                  {/* Calendar Header & Legend */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                        Schedule Calendar
                      </h3>
                      <p className={`text-xs ${designTokens.colors.text.muted}`}>
                        Provided language slots owned by {selectedProfile.fullName || "member"} (Click an available slot to book)
                      </p>
                    </div>

                    {/* Color Status Legend */}
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#0284c7]" />
                        <span className="text-neutral-700">Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#ef4444]" />
                        <span className="text-neutral-700">Booked (Occupied)</span>
                      </div>
                    </div>
                  </div>

                  {/* FullCalendar Component */}
                  <div className="fullcalendar-custom-wrapper max-h-[600px] overflow-y-auto">
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      allDaySlot={false}
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={calendarEvents}
                      eventClick={handleEventClick}
                      height="auto"
                      selectable={false}
                      editable={false}
                    />
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* Booking Confirmation Modal */}
      {selectedSlotToBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6 select-none animate-in zoom-in-95 duration-200`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  SLOT_BOOKING_CONFIRMATION
                </span>
                <h3 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
                  Do you want to book this slot?
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotToBook(null)}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Slot Details Body */}
            <div className="flex flex-col gap-3.5 bg-neutral-50/80 p-4 rounded-xl border border-neutral-100">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Slot Title</span>
                <span className={`text-xs font-bold ${designTokens.colors.text.primary} text-right`}>
                  {selectedSlotToBook.title}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Host Member</span>
                <span className={`text-xs font-bold ${designTokens.colors.text.primary} text-right`}>
                  {selectedProfile?.fullName || selectedProfile?.email || "Member"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Start Time</span>
                <span className={`text-xs font-medium text-neutral-700 text-right`}>
                  {new Date(selectedSlotToBook.startTime).toLocaleString([], {
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
                <span className={`text-xs font-medium text-neutral-700 text-right`}>
                  {new Date(selectedSlotToBook.endTime).toLocaleString([], {
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
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                  {selectedSlotToBook.durationMinutes} mins
                </span>
              </div>

              {selectedSlotToBook.id && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Room ID</span>
                  <span className="font-mono text-[11px] text-neutral-600 truncate max-w-[180px]">
                    {selectedSlotToBook.id}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSlotToBook(null)}
                className={`px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBook}
                className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer flex items-center gap-1.5`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
