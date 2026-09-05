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

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

/**
 * SlotCalendar
 *
 * BEHAVIORAL MECHANISM:
 * Renders a FullCalendar timeGridWeek view with 5-minute slot intervals.
 * Automatically focuses and scrolls directly to current time indicator without requiring manual scrolling down.
 * Wrapped in React.memo to prevent FullCalendar from performing expensive DOM
 * re-renders when unrelated parent state changes.
 */
const SlotCalendar = memo(function SlotCalendar({
  events,
  onDateSelect,
  onEventClick,
}: SlotCalendarProps) {
  const currentTimeString = getCurrentTimeString();
  const calendarRef = React.useRef<FullCalendar>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // On mobile devices, default to 3-day view for much cleaner column spacing
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView("timeGrid3Days");
      }
    }
  }, []);

  React.useEffect(() => {
    // Focus and scroll directly to current time indicator line automatically on render
    const scrollNow = () => {
      const nowLine = containerRef.current?.querySelector(".fc-now-indicator-line");
      if (nowLine) {
        nowLine.scrollIntoView({ block: "center", behavior: "auto" });
      } else if (calendarRef.current) {
        calendarRef.current.getApi().scrollToTime(currentTimeString);
      }
    };

    const timer = setTimeout(scrollNow, 120);
    return () => clearTimeout(timer);
  }, [currentTimeString]);

  return (
    <>
      {/* Section Header + Status Legend */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${designTokens.colors.border.default} pb-4`}>
        <div>
          <h2 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
            Manage Slots Calendar
          </h2>
          <p className={`text-xs ${designTokens.colors.text.muted}`}>
            Click or drag on dates/times to schedule a new slot. Click existing slots for details &amp; actions.
          </p>
        </div>

        {/* Color Status Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 text-[11px] sm:text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#d97757] shadow-xs border border-[#82301c]" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>OPEN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#9a3412] shadow-xs" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>BOOKED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#5c4a44] shadow-xs" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>COMPLETED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#d6cbc6] shadow-xs border border-[#927f78]" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>CANCELLED</span>
          </div>
        </div>
      </div>

      {/* FullCalendar Container */}
      <div
        ref={containerRef}
        className="calendar-container max-h-[700px] overflow-y-auto rounded-xl border border-[#dfccc1] p-1.5 sm:p-3 bg-[#fffdfb] shadow-xs [&_.fc-timegrid-slot]:!h-7 sm:[&_.fc-timegrid-slot]:!h-6 [&_.fc-toolbar]:!flex-col sm:[&_.fc-toolbar]:!flex-row [&_.fc-toolbar]:!gap-2.5 [&_.fc-toolbar]:!items-center [&_.fc-toolbar]:!justify-between [&_.fc-toolbar-chunk]:!flex [&_.fc-toolbar-chunk]:!flex-wrap [&_.fc-toolbar-chunk]:!items-center [&_.fc-toolbar-chunk]:!justify-center [&_.fc-toolbar-chunk]:!gap-1 [&_.fc-button-primary]:!bg-[#82301c] [&_.fc-button-primary]:!border-[#6c2716] [&_.fc-button-primary:hover]:!bg-[#6c2716] [&_.fc-button-primary:disabled]:!bg-[#dfccc1] [&_.fc-button]:!text-xs [&_.fc-button]:!px-2 [&_.fc-button]:!py-1 sm:[&_.fc-button]:!px-3 sm:[&_.fc-button]:!py-1.5 [&_.fc-button]:!rounded-lg [&_.fc-toolbar-title]:!text-sm sm:[&_.fc-toolbar-title]:!text-base lg:[&_.fc-toolbar-title]:!text-lg [&_.fc-toolbar-title]:!text-[#82301c] [&_.fc-toolbar-title]:!font-bold [&_.fc-col-header-cell]:!bg-[#f8ede6] [&_.fc-col-header-cell]:!text-[#82301c] [&_.fc-col-header-cell]:!py-1.5 [&_.fc-col-header-cell-cushion]:!text-xs sm:[&_.fc-col-header-cell-cushion]:!text-sm [&_.fc-col-header-cell-cushion]:!font-bold [&_.fc-timegrid-slot-label-cushion]:!text-[10px] sm:[&_.fc-timegrid-slot-label-cushion]:!text-xs [&_.fc-timegrid-slot-label-cushion]:!font-semibold [&_.fc-timegrid-slot-label-cushion]:!text-[#61514d] [&_.fc-v-event]:!min-h-[26px] [&_.fc-v-event]:!rounded-md [&_.fc-v-event]:!shadow-xs [&_.fc-event-main]:!p-1 [&_.fc-event-main]:!flex [&_.fc-event-main]:!flex-col [&_.fc-event-main]:!justify-start [&_.fc-event-title]:!text-[11px] sm:[&_.fc-event-title]:!text-xs [&_.fc-event-title]:!font-bold [&_.fc-event-title]:!leading-tight [&_.fc-event-title]:!whitespace-normal [&_.fc-event-title]:!break-words [&_.fc-event-time]:!text-[10px] sm:[&_.fc-event-time]:!text-[11px] [&_.fc-event-time]:!font-semibold [&_.fc-event-time]:!opacity-95 [&_.fc-now-indicator-line]:!border-[#82301c] [&_.fc-now-indicator-line]:!border-2 [&_.fc-now-indicator-arrow]:!border-l-[#82301c] [&_.fc-theme-standard_td]:!border-[#dfccc1] [&_.fc-theme-standard_th]:!border-[#dfccc1] [&_.fc-theme-standard]:!border-[#dfccc1]"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          views={{
            timeGrid3Days: {
              type: "timeGrid",
              duration: { days: 3 },
              buttonText: "3 days",
            },
          }}
          slotDuration="00:05:00"
          scrollTime={currentTimeString}
          scrollTimeReset={false}
          nowIndicator={true}
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGrid3Days,timeGridDay",
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
