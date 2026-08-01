/**
 * PURPOSE:
 * Full-screen animated booking confirmation modal dialog.
 * Displays slot details (title, host member, start/end times, duration, room ID)
 * and asks the user to confirm or cancel the booking request.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 426-534).
 * Rendered conditionally when a user clicks an available slot on the schedule calendar.
 *
 * INPUTS / PARAMETERS:
 * - slot (SlotUncheckedCreateInput | null, Required): The selected slot object to book, or null if modal is closed.
 * - hostName (string, Required): Display name of the host member who owns the slot.
 * - onClose (function, Required): Callback invoked to dismiss the modal without booking.
 * - onConfirm (function, Required): Async callback invoked when user clicks the Book confirmation button.
 */

"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";

interface BookingModalProps {
  slot: SlotUncheckedCreateInput | null;
  hostName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * BookingModal
 *
 * BEHAVIORAL MECHANISM:
 * Uses AnimatePresence to animate the backdrop blur and dialog card when slot is non-null.
 * Shows formatted start and end times, duration, and room ID. On confirmation, calls onConfirm.
 */
const BookingModal = memo(function BookingModal({
  slot,
  hostName,
  onClose,
  onConfirm,
}: BookingModalProps) {
  return (
    <AnimatePresence>
      {slot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#291e1b]/40 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6 select-none`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between gap-4 border-b ${designTokens.colors.border.default} pb-4`}>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#82301c]">
                  SLOT_BOOKING_CONFIRMATION
                </span>
                <h3 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
                  Do you want to book this slot?
                </h3>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8c87] hover:text-[#82301c] hover:bg-[#ebdcd3] transition cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Slot Details Body */}
            <div className="flex flex-col gap-3.5 bg-[#f8ede6] p-4 rounded-xl border border-[#dfccc1]">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Slot Title</span>
                <span className={`text-xs font-bold ${designTokens.colors.text.primary} text-right`}>
                  {slot.title}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Host Member</span>
                <span className={`text-xs font-bold ${designTokens.colors.text.primary} text-right`}>
                  {hostName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Start Time</span>
                <span className={`text-xs font-bold text-[#82301c] text-right`}>
                  {new Date(slot.startTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>End Time</span>
                <span className={`text-xs font-bold text-[#82301c] text-right`}>
                  {new Date(slot.endTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Duration</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
                  {slot.durationMinutes} mins
                </span>
              </div>

              {slot.id && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>Room ID</span>
                  <span className="font-mono text-[11px] text-[#61514d] truncate max-w-[180px]">
                    {slot.id}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-[#ebdcd3] transition cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} shadow-md shadow-[#82301c]/20 hover:opacity-95 transition cursor-pointer flex items-center gap-1.5`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Book Slot
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default BookingModal;
