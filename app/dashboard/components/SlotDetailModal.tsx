/**
 * PURPOSE:
 * Animated full-screen modal dialog for viewing slot details and performing actions.
 * Wrapped in React.memo to prevent re-renders when detail is null or parent updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 */

"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types";
import { SlotStatus } from "@/app/types/enum";
import { designTokens } from "@/app/constants/design-tokens";
import { getStatusBadgeStyle, checkIsMeetingAvailable, parseUtcDate } from "./helpers";

interface SlotDetailModalProps {
  detail: {
    slot: SlotUncheckedCreateInput;
    isOwner: boolean;
    status: SlotStatus;
  } | null;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  onGoToMeeting: (slotId: string) => void;
}

const SlotDetailModal = memo(function SlotDetailModal({
  detail,
  isLoading,
  onClose,
  onDelete,
  onGoToMeeting,
}: SlotDetailModalProps) {
  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6 select-none`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    SLOT_DETAILS
                  </span>
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${getStatusBadgeStyle(detail.status)}`}
                  >
                    {detail.status}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
                  {detail.slot.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer shrink-0 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Read-only Slot Info */}
            <div className="flex flex-col gap-3.5 bg-neutral-50/80 p-4 rounded-xl border border-neutral-100">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                  My Role
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                    detail.isOwner
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}
                >
                  {detail.isOwner ? "Host / Owner (Provided)" : "Participant (Exchanged)"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                  Slot Status
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getStatusBadgeStyle(detail.status)}`}
                >
                  {detail.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                  Start Time
                </span>
                <span className="text-xs font-medium text-neutral-700 text-right">
                  {parseUtcDate(detail.slot.startTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                  End Time
                </span>
                <span className="text-xs font-medium text-neutral-700 text-right">
                  {parseUtcDate(detail.slot.endTime).toLocaleString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                  Duration
                </span>
                <span className="text-xs font-bold text-neutral-800">
                  {detail.slot.durationMinutes} mins
                </span>
              </div>

              {detail.slot.id && (
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${designTokens.colors.text.muted}`}>
                    Room ID
                  </span>
                  <span className="font-mono text-[11px] text-neutral-600 truncate max-w-[180px]">
                    {detail.slot.id}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons based on SlotStatus */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
              >
                Close
              </button>

              {/* Status OPEN -> Delete Button */}
              {detail.status === SlotStatus.OPEN && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Slot
                </button>
              )}

              {/* Status BOOKED -> Go to Meeting Button */}
              {detail.status === SlotStatus.BOOKED && (
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    disabled={!checkIsMeetingAvailable(detail.slot)}
                    onClick={() => onGoToMeeting(detail.slot.id!)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Go to the meeting
                  </button>
                  {!checkIsMeetingAvailable(detail.slot) && (
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Available 5 mins before start time
                    </span>
                  )}
                </div>
              )}

              {/* Status COMPLETED or CANCELLED -> No extra action button */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SlotDetailModal;
