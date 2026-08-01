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
import { motion } from "framer-motion";
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

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

/**
 * MemberScheduleCalendar
 *
 * BEHAVIORAL MECHANISM:
 * Renders FullCalendar with timeGridWeek view and slotDuration="00:05:00".
 * Wrapped in Framer Motion motion.div for smooth entrance transitions on load and member switch.
 * Automatically focuses and scrolls directly to current time indicator line.
 * Wrapped in React.memo to ensure optimal performance.
 */
const MemberScheduleCalendar = memo(function MemberScheduleCalendar({
  memberName,
  events,
  onEventClick,
}: MemberScheduleCalendarProps) {
  const currentTimeString = getCurrentTimeString();
  const calendarRef = React.useRef<FullCalendar>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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
    <motion.div
      key={memberName}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
    >
      {/* Calendar Header & Legend */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${designTokens.colors.border.default} pb-4`}>
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
            <span className="w-3 h-3 rounded-full bg-[#d97757] border border-[#82301c] shadow-xs" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#9a3412] shadow-xs" />
            <span className={`font-semibold ${designTokens.colors.text.primary}`}>Booked (Occupied)</span>
          </div>
        </div>
      </div>

      {/* FullCalendar Component */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        ref={containerRef}
        className="fullcalendar-custom-wrapper max-h-[650px] overflow-y-auto rounded-xl border border-[#dfccc1] p-3 bg-[#fffdfb] shadow-xs [&_.fc-button-primary]:!bg-[#82301c] [&_.fc-button-primary]:!border-[#6c2716] [&_.fc-button-primary:hover]:!bg-[#6c2716] [&_.fc-button-primary:disabled]:!bg-[#dfccc1] [&_.fc-toolbar-title]:!text-[#82301c] [&_.fc-toolbar-title]:!font-bold [&_.fc-col-header-cell]:!bg-[#f8ede6] [&_.fc-col-header-cell]:!text-[#82301c] [&_.fc-col-header-cell]:!py-2 [&_.fc-now-indicator-line]:!border-[#82301c] [&_.fc-now-indicator-line]:!border-2 [&_.fc-now-indicator-arrow]:!border-l-[#82301c] [&_.fc-theme-standard_td]:!border-[#dfccc1] [&_.fc-theme-standard_th]:!border-[#dfccc1] [&_.fc-theme-standard]:!border-[#dfccc1]"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          slotDuration="00:05:00"
          scrollTime={currentTimeString}
          scrollTimeReset={false}
          nowIndicator={true}
          events={events}
          eventClick={onEventClick}
          height="auto"
          selectable={false}
          editable={false}
        />
      </motion.div>
    </motion.div>
  );
});

export default MemberScheduleCalendar;
