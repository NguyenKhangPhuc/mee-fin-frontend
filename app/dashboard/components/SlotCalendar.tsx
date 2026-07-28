/**
 * PURPOSE:
 * Wraps the FullCalendar component and its section header (title, description,
 * and color-status legend) into a single self-contained unit. Receives pre-built
 * calendar events and delegates all interaction events upward to the parent
 * orchestrator via callback props.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 * Mounted as the Manage Slots Calendar card content in the dashboard.
 *
 * INPUTS / PARAMETERS:
 * - events (CalendarEvent[], Required): Pre-built FullCalendar event objects constructed by buildCalendarEvents.
 * - onDateSelect (function, Required): Callback triggered when the user selects a date/time range.
 * - onEventClick (function, Required): Callback triggered when an existing event is clicked.
 */

"use client";

import React, { memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { designTokens } from "@/app/constants/design-tokens";
import { CalendarEvent, DateSelectArg } from "./types";

interface SlotCalendarProps {
  events: CalendarEvent[];
  onDateSelect: (info: DateSelectArg) => void;
  onEventClick: (info: any) => void;
}

/**
 * SlotCalendar
 *
 * BEHAVIORAL MECHANISM:
 * Renders a FullCalendar timeGridWeek view with selectable mode enabled.
 * Wrapped in React.memo to prevent FullCalendar from performing expensive DOM
 * re-renders when unrelated parent state changes.
 */
const SlotCalendar = memo(function SlotCalendar({
  events,
  onDateSelect,
  onEventClick,
}: SlotCalendarProps) {
  return (
    <>
      {/* Section Header + Status Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
            Manage Slots Calendar
          </h2>
          <p className={`text-xs ${designTokens.colors.text.muted}`}>
            Click or drag on dates/times to schedule a new slot. Click existing slots for details &amp; actions.
          </p>
        </div>

        {/* Color Status Legend */}
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

      {/* FullCalendar */}
      <div className="calendar-container max-h-[600px] overflow-y-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotDuration="00:05:00"
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable={true}
          selectMirror={false}
          editable={false}
          eventDurationEditable={false}
          eventStartEditable={false}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={onDateSelect}
          eventClick={onEventClick}
          height="auto"
        />
      </div>
    </>
  );
});

export default SlotCalendar;
