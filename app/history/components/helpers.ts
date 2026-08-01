/**
 * PURPOSE:
 * Pure utility helper functions for the Meeting History module.
 * Provides status badge style resolvers matching UserDashboardClient.tsx
 * and UTC date parsing helpers.
 *
 * CONTEXT/PARENT FILE:
 * Imported by HistorySlotCard.tsx and HistoryClient.tsx in app/history/.
 */

import { SlotStatus } from "@/app/types/enum";

/**
 * getStatusBadgeStyle
 *
 * BEHAVIORAL MECHANISM:
 * Maps a SlotStatus enum value to Tailwind CSS classes for badge rendering,
 * using the exact color tokens from UserDashboardClient.tsx.
 *
 * PARAMETERS:
 * - status (SlotStatus | string): The slot status string/enum value.
 *
 * RETURNS:
 * - string: Space-separated Tailwind utility classes.
 */
export const getStatusBadgeStyle = (status: SlotStatus | string): string => {
  switch (status) {
    case SlotStatus.OPEN:
      return "bg-[#d97757]/20 text-[#82301c] border-[#d97757]/40";
    case SlotStatus.BOOKED:
      return "bg-[#9a3412]/10 text-[#9a3412] border-[#9a3412]/30";
    case SlotStatus.COMPLETED:
      return "bg-[#5c4a44]/10 text-[#5c4a44] border-[#5c4a44]/30";
    case SlotStatus.CANCELLED:
      return "bg-[#d6cbc6]/40 text-[#61514d] border-[#dfccc1]";
    default:
      return "bg-[#ebdcd3] text-[#61514d] border-[#dfccc1]";
  }
};

/**
 * parseUtcDate
 *
 * BEHAVIORAL MECHANISM:
 * Converts UTC timestamp strings from the backend into JavaScript Date objects
 * in local browser timezone.
 */
export const parseUtcDate = (dateVal: string | Date | undefined | null): Date => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) return dateVal;

  let str = String(dateVal).trim();
  if (!str) return new Date();

  str = str.replace(" ", "T");
  const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/i.test(str);
  const normalized = hasTimezone ? str : `${str}Z`;

  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? new Date(dateVal) : parsed;
};
