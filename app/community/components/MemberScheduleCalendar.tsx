/**
 * PURPOSE:
 * Displays the selected member's schedule calendar card and status legend.
 * Integrates FullCalendar in a timeGridWeek view with 5-minute slot intervals.
 * Wrapped in React.memo to prevent FullCalendar DOM destruction/re-render lag
 * when searching or interacting with unrelated UI elements.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 370-415).
 * Mounted in the right column (lg:col-span-8) of the Community page main layout.
 *
 * INPUTS / PARAMETERS:
 * - memberName (string, Required): Display name of the selected member for the card sub-header.
 * - events (CalendarEvent[], Required): Array of memoized FullCalendar event objects.
 * - onEventClick (function, Required): Callback invoked when an event on the calendar is clicked.
 */

"use client";

import React, { memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { designTokens } from "@/app/constants/design-tokens";
import { CalendarEvent } from "./types";

interface MemberScheduleCalendarProps {
  memberName: string;
  events: CalendarEvent[];
  onEventClick: (clickInfo: any) => void;
}

/**
 * MemberScheduleCalendar
 *
 * BEHAVIORAL MECHANISM:
 * Renders FullCalendar with timeGridWeek view and slotDuration="00:05:00".
 * Wrapped in React.memo to ensure that FullCalendar is only updated when events
 * or onEventClick change, maintaining optimal performance.
 */
const MemberScheduleCalendar = memo(function MemberScheduleCalendar({
  memberName,
  events,
  onEventClick,
}: MemberScheduleCalendarProps) {
  return (
    <div className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>
      {/* Calendar Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
            Schedule Calendar
          </h3>
          <p className={`text-xs ${designTokens.colors.text.muted}`}>
            Provided language slots owned by {memberName} (Click an available slot to book)
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
          slotDuration="00:05:00"
          slotLabelInterval="00:30:00"
          events={events}
          eventClick={onEventClick}
          height="auto"
          selectable={false}
          editable={false}
        />
      </div>
    </div>
  );
});

export default MemberScheduleCalendar;
