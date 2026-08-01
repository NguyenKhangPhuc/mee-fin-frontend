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
 * buildEventsForProfile
 *
 * BEHAVIORAL MECHANISM:
 * Maps the provided slots of the given profile to FullCalendar event objects.
 * Checks whether each slot is booked by inspecting exchangeUserId, status,
 * or isBooked properties. Applies red styling for booked slots and theme accent
 * sky styling for available slots. Computes an end time fallback when endTime is not set.
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
    const startTime = new Date(slot.startTime);
    const endTime = slot.endTime
      ? new Date(slot.endTime)
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
