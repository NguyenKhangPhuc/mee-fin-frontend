/**
 * PURPOSE:
 * Pure utility functions for the dashboard module. Contains no JSX or React hooks.
 * Provides badge-style resolvers, a meeting-availability checker, and the calendar
 * event builder logic extracted from UserDashboardClient.tsx.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx (lines 88-142, 308-316, 362-386).
 * Imported by UserLanguagesSection, SlotDetailModal, and UserDashboardClient.
 *
 * INPUTS / PARAMETERS:
 * None at module level. All utilities are standalone exported functions.
 */

import { SlotUncheckedCreateInput } from "@/app/types";
import { SlotStatus } from "@/app/types/enum";
import { CalendarEvent } from "./types";

/**
 * getProficiencyBadgeStyle
 *
 * BEHAVIORAL MECHANISM:
 * Maps a proficiency string to a set of Tailwind classes representing the
 * appropriate badge color for that proficiency level. Returns a neutral fallback
 * for any unrecognized value (e.g. "BEGINNER").
 *
 * PARAMETERS:
 * - prof (string): The proficiency level string ("ADVANCED", "INTERMEDIATE", or any fallback).
 *
 * RETURNS:
 * - string: A space-separated string of Tailwind utility classes.
 */
export const getProficiencyBadgeStyle = (prof: string): string => {
  switch (prof) {
    case "ADVANCED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "INTERMEDIATE":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
  }
};

/**
 * getStatusBadgeStyle
 *
 * BEHAVIORAL MECHANISM:
 * Maps a SlotStatus enum value to a set of Tailwind classes for a colored badge.
 * Each status maps to a distinct color so users can quickly distinguish slot states.
 *
 * PARAMETERS:
 * - status (SlotStatus): The current slot status enum value.
 *
 * RETURNS:
 * - string: A space-separated string of Tailwind utility classes.
 */
export const getStatusBadgeStyle = (status: SlotStatus): string => {
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

/**
 * checkIsMeetingAvailable
 *
 * BEHAVIORAL MECHANISM:
 * Compares the current timestamp against the slot's start and end times.
 * The meeting button becomes available 5 minutes before the slot starts and
 * remains available until the slot ends. If no endTime is provided, it falls
 * back to startTime + durationMinutes (defaulting to 30 minutes).
 *
 * PARAMETERS:
 * - slot (SlotUncheckedCreateInput): The slot object containing startTime, endTime, and durationMinutes.
 *
 * RETURNS:
 * - boolean: True if the current time is within the meeting availability window.
 */
export const checkIsMeetingAvailable = (slot: SlotUncheckedCreateInput): boolean => {
  if (!slot.startTime) return false;
  const now = new Date().getTime();
  const startTimeMs = new Date(slot.startTime).getTime();
  const endTimeMs = slot.endTime
    ? new Date(slot.endTime).getTime()
    : startTimeMs + (slot.durationMinutes || 30) * 60000;

  return now >= startTimeMs - 5 * 60 * 1000 && now <= endTimeMs;
};

/**
 * buildCalendarEvents
 *
 * BEHAVIORAL MECHANISM:
 * Merges provided and exchanged slot arrays into a Map keyed by slot ID to
 * deduplicate any overlap. Then iterates the Map to construct FullCalendar
 * event objects, deriving color from slot status and computing a fallback
 * endTime when one is not explicitly set.
 *
 * PARAMETERS:
 * - provideSlots (SlotUncheckedCreateInput[]): Slots owned by the current user.
 * - exchangeSlots (SlotUncheckedCreateInput[]): Slots the user has booked as participant.
 *
 * RETURNS:
 * - CalendarEvent[]: An array of FullCalendar-compatible event objects.
 */
export const buildCalendarEvents = (
  provideSlots: SlotUncheckedCreateInput[],
  exchangeSlots: SlotUncheckedCreateInput[]
): CalendarEvent[] => {
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

    const status =
      (slot.status as SlotStatus) ||
      (slot.exchangeUserId ? SlotStatus.BOOKED : SlotStatus.OPEN);

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
