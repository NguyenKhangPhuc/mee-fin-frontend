/**
 * PURPOSE:
 * Renders an individual meeting slot card in the History page, displaying meeting status,
 * title, date/time, duration, provide/exchange languages, participant names (Host & Guest),
 * both user-given rating and received partner rating, and rating management controls.
 * Wrapped in React.memo for high performance.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - slot (SlotUncheckedCreateInput, Required): The meeting slot data.
 * - index (number, Required): Position index used for Framer Motion stagger delay calculation.
 * - currentUserId (string, Required): Currently logged in user ID.
 * - onRate (function, Required): Callback invoked to open the RatingModal for a new rating.
 * - onEditRating (function, Required): Callback invoked to open RatingModal for editing a rating.
 * - onDeleteRating (function, Required): Callback invoked to open delete rating confirmation dialog.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types/slot";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { SlotStatus } from "@/app/types/enum";
import { designTokens } from "@/app/constants/design-tokens";

interface HistorySlotCardProps {
  slot: SlotUncheckedCreateInput;
  index: number;
  currentUserId: string;
  onRate: (slot: SlotUncheckedCreateInput) => void;
  onEditRating: (
    slot: SlotUncheckedCreateInput,
    rating: SlotRatingUncheckedCreateInput
  ) => void;
  onDeleteRating: (slotId: string, ratingId: string) => void;
}

/**
 * HistorySlotCard
 *
 * BEHAVIORAL MECHANISM:
 * Renders slot details including status badge, host and guest names, languages, time, and dual ratings.
 * Identifies both givenRating (created by current user) and receivedRating (created by partner).
 * Displays partner name on both participant headers and rating blocks.
 *
 * PARAMETERS:
 * - props (HistorySlotCardProps): Contains slot item, current user ID, and action callbacks.
 *
 * RETURNS:
 * - JSX.Element: The slot history card element.
 */
const HistorySlotCard = memo(function HistorySlotCard({
  slot,
  index,
  currentUserId,
  onRate,
  onEditRating,
  onDeleteRating,
}: HistorySlotCardProps) {
  const isHost = slot.ownerId === currentUserId;

  // Participant Names
  const hostName = slot.owner?.fullName || slot.owner?.email || "Host";
  const guestName = slot.exchangeUser?.fullName || slot.exchangeUser?.email || "Guest / Unbooked";
  const partnerName = isHost ? guestName : hostName;

  // Rating Given by Current User for Partner
  const givenRating = slot.slotRatings?.find(
    (r) => r.raterId === currentUserId
  );

  // Rating Received by Current User from Partner
  const receivedRating = slot.slotRatings?.find(
    (r) => r.raterId !== currentUserId
  );

  const status = slot.status || SlotStatus.OPEN;
  let statusBadgeStyle = "bg-neutral-100 text-neutral-600 border-neutral-200";
  if (status === SlotStatus.COMPLETED) {
    statusBadgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === SlotStatus.BOOKED) {
    statusBadgeStyle = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (status === SlotStatus.CANCELLED) {
    statusBadgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
  }

  const startDateStr = slot.startTime
    ? new Date(slot.startTime).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const startTimeStr = slot.startTime
    ? new Date(slot.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const isCompleted = status === SlotStatus.COMPLETED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} flex flex-col justify-between gap-5 transition-all duration-200 hover:shadow-lg relative overflow-hidden`}
    >
      {/* Top Slot Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${statusBadgeStyle}`}>
            {status}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
            {isHost ? "Role: Host" : "Role: Guest"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{startDateStr} at {startTimeStr} ({slot.durationMinutes || 30} mins)</span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2.5 min-w-0 flex-1">
          <h3 className={`text-lg font-bold ${designTokens.colors.text.primary} truncate`}>
            {slot.title}
          </h3>

          {/* Participant Names */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Host:</span>
              <span className="font-bold text-neutral-800">{hostName}</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Guest:</span>
              <span className="font-bold text-neutral-800">{guestName}</span>
            </div>
          </div>

          {/* Language Preferences Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs mt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="font-semibold">Provide:</span>
              <span>{slot.provideLanguage?.name || "Language"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              <span className="font-semibold">Exchange:</span>
              <span>{slot.exchangeLanguage?.name || "Language"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section Footer */}
      <div className="flex flex-col gap-3.5 pt-4 border-t border-neutral-100 bg-neutral-50/60 p-4 rounded-xl">
        {/* 1. GIVEN RATING (Your Rating for Partner) */}
        <div className="flex flex-col gap-2">
          {givenRating ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white border border-neutral-200/80">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-700">
                    Your Rating for <span className="text-sky-700">{partnerName}</span>:
                  </span>
                  <div className="flex items-center text-amber-400 text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= (givenRating.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    ({givenRating.rating}/5)
                  </span>
                </div>
                {givenRating.feedback && (
                  <p className="text-xs text-neutral-600 italic">
                    &quot;{givenRating.feedback}&quot;
                  </p>
                )}
              </div>

              {/* Action Buttons for Rating: Edit & Delete */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onEditRating(slot, givenRating)}
                  className={`px-3 py-1.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => givenRating.id && onDeleteRating(slot.id!, givenRating.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition cursor-pointer flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white border border-neutral-200/80">
              <span className="text-xs text-neutral-500 font-medium">
                {isCompleted
                  ? `You have not rated ${partnerName} yet.`
                  : "Rating is available after the meeting is completed."}
              </span>
              {isCompleted && (
                <button
                  type="button"
                  onClick={() => onRate(slot)}
                  className={`px-3.5 py-1.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer flex items-center gap-1.5 shrink-0`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Rate {partnerName}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2. RECEIVED RATING (Partner's Rating for You) */}
        {isCompleted && (
          <div className="p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col gap-1">
            {receivedRating ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-900">
                    {partnerName}&apos;s Rating for You:
                  </span>
                  <div className="flex items-center text-amber-400 text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= (receivedRating.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    ({receivedRating.rating}/5)
                  </span>
                </div>
                {receivedRating.feedback && (
                  <p className="text-xs text-sky-950 italic">
                    &quot;{receivedRating.feedback}&quot;
                  </p>
                )}
              </div>
            ) : (
              <span className="text-xs text-sky-700/80 font-medium">
                {partnerName} has not rated this meeting yet.
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default HistorySlotCard;
