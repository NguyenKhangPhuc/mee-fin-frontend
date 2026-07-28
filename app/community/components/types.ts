/**
 * PURPOSE:
 * Local TypeScript interfaces used across the community module components.
 * Centralizes type definitions that were previously inline in CommunityClient.tsx
 * to share them cleanly across extracted component files.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 21-33).
 * Imported by helpers.ts, MemberScheduleCalendar.tsx, and CommunityClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * None. This file exports TypeScript interfaces only — no runtime code.
 */

export interface CalendarEvent {
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
