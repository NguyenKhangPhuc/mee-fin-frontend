/**
 * PURPOSE:
 * Local TypeScript interfaces used across the dashboard module components.
 * Centralizes type definitions that were previously scattered inside
 * UserDashboardClient.tsx to avoid duplication across extracted component files.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx (lines 23-56).
 * Imported by AvatarUploader, ProfileForm, UserLanguagesSection, SlotCalendar,
 * CreateSlotModal, SlotDetailModal, and UserDashboardClient.
 *
 * INPUTS / PARAMETERS:
 * None. This file exports TypeScript interfaces only — no runtime code.
 */

import { SlotUncheckedCreateInput } from "@/app/types";
import { SlotStatus } from "@/app/types/enum";

export interface DateSelectArg {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  allDay: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    slot: SlotUncheckedCreateInput;
    isOwner: boolean;
    status: SlotStatus;
  };
}

export interface SlotFormInput {
  title: string;
  provideLanguageId: string;
  exchangeLanguageId: string;
  durationMinutes: number;
}
