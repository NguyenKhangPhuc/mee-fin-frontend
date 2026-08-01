/**
 * PURPOSE:
 * Pure utility functions for the community module. Contains zero JSX or React hooks.
 * Provides the calendar event mapping logic extracted from CommunityClient.tsx.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 60-91).
 * Imported by CommunityClient.tsx to build events inside a useMemo hook.
 *
 * INPUTS / PARAMETERS:
 * None at module level. All functions are standalone exports.
 */

import { ProfileUncheckedCreateInput, SlotUncheckedCreateInput } from "@/app/types";
import { CalendarEvent } from "./types";

/**
 * parseUtcDate
 *
 * Safely parses UTC string dates returned by API/Database and converts them to
 * proper local JavaScript Date objects in the user's local browser timezone.
 */
export const parseUtcDate = (dateVal: string | Date | undefined | null): Date => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) return dateVal;

  let str = String(dateVal).trim();
  if (!str) return new Date();

  // Replace space separator with T
  str = str.replace(" ", "T");

  // If string does not specify timezone offset (Z or +hh:mm or -hh:mm), append Z for UTC
  const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/i.test(str);
  const normalized = hasTimezone ? str : `${str}Z`;

  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? new Date(dateVal) : parsed;
};

/**
 * buildEventsForProfile
 *
 * BEHAVIORAL MECHANISM:
 * Maps the provided slots of the given profile to FullCalendar event objects.
 * Checks whether each slot is booked by inspecting exchangeUserId, status,
 * or isBooked properties. Converts UTC timestamps into user's local timezone.
 *
 * PARAMETERS:
 * - profile (ProfileUncheckedCreateInput | null): The selected profile containing provideSlots.
 *
 * RETURNS:
 * - CalendarEvent[]: An array of FullCalendar event objects ready for display.
 */
export const buildEventsForProfile = (
  profile: ProfileUncheckedCreateInput | null
): CalendarEvent[] => {
  if (!profile || !profile.provideSlots) return [];

  return profile.provideSlots.map((slot: SlotUncheckedCreateInput) => {
    const startTime = parseUtcDate(slot.startTime);
    const endTime = slot.endTime
      ? parseUtcDate(slot.endTime)
      : new Date(startTime.getTime() + (slot.durationMinutes || 30) * 60000);

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
      backgroundColor: isBooked ? "#9a3412" : "#d97757",
      borderColor: isBooked ? "#7c2d12" : "#82301c",
      textColor: "#ffffff",
      extendedProps: {
        isBooked,
        durationMinutes: slot.durationMinutes,
      },
    };
  });
};
