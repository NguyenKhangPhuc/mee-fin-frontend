"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { ProfileUncheckedCreateInput, SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";

interface CommunityClientProps {
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

export default function CommunityClient({ profiles }: CommunityClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    profiles[0]?.id || ""
  );

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const name = p.fullName?.toLowerCase() || "";
    const email = p.email?.toLowerCase() || "";
    const uni = p.university?.toLowerCase() || "";
    const prog = p.programme?.toLowerCase() || "";
    return name.includes(q) || email.includes(q) || uni.includes(q) || prog.includes(q);
  });

  const selectedProfile =
    profiles.find((p) => p.id === selectedProfileId) || profiles[0] || null;

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

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans`}>
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
        {profiles.length === 0 ? (
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
                      className={`w-full text-left p-4 ${designTokens.radii.card} border transition-all flex items-center gap-3.5 cursor-pointer ${
                        isSelected
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
                        Provided language slots owned by {selectedProfile.fullName || "member"}
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
                  <div className="fullcalendar-custom-wrapper">
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={calendarEvents}
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
    </div>
  );
}
