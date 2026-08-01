/**
 * PURPOSE:
 * Renders an individual meeting slot card in the History page, displaying meeting status,
 * title, date/time, duration, provide/exchange languages, participant display names (Host & Guest),
 * both user-given rating and received partner rating (with star counts & feedback quotes), and rating management controls.
 * Redesigned to match the #82301c theme token design system and status badge helpers.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/history/HistoryClient.tsx.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types/slot";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { SlotStatus } from "@/app/types/enum";
import { getStatusBadgeStyle, parseUtcDate } from "./helpers";

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
 * Renders slot details including status badge, host and guest display names, languages, time, and dual ratings.
 * Displays partner rating received and user rating given with filled star icons (★/☆) and feedback quotes.
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

  // Participant Display Names
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

  // Extract numerical star values safely supporting rating / stars property names
  const givenRatingStars = givenRating?.rating ?? (givenRating as any)?.stars ?? 0;
  const receivedRatingStars = receivedRating?.rating ?? (receivedRating as any)?.stars ?? 0;

  const status = (slot.status as SlotStatus) || SlotStatus.OPEN;
  const statusBadgeStyle = getStatusBadgeStyle(status);

  const parsedStart = parseUtcDate(slot.startTime);
  const startDateStr = slot.startTime
    ? parsedStart.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const startTimeStr = slot.startTime
    ? parsedStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className="p-5 sm:p-6 bg-[#fcf7f3] rounded-3xl border border-[#dfccc1] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4 font-sans select-none"
    >
      {/* Top Header Row: Status Badge & Role Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-[#dfccc1]/60 pb-3.5">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusBadgeStyle}`}>
            {status}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
            {isHost ? "Host" : "Participant"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#82301c]/80 font-bold">
          <svg className="w-4 h-4 text-[#d97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{startDateStr}</span>
          {startTimeStr && <span>• {startTimeStr}</span>}
        </div>
      </div>

      {/* Middle Section: Slot Title & Participants Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Title & Languages (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <h3 className="text-base sm:text-lg font-bold text-[#82301c] line-clamp-1">
            {slot.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5c4a44]">
            <span className="flex items-center gap-1 bg-[#fffdfb] px-2.5 py-1 rounded-lg border border-[#dfccc1]">
              <span className="text-[10px] text-[#82301c]/60 font-bold uppercase">Provide:</span>
              <span className="text-[#82301c] font-bold">{slot.provideLanguage?.name || "N/A"}</span>
            </span>

            <span className="text-[#82301c]/40">↔</span>

            <span className="flex items-center gap-1 bg-[#fffdfb] px-2.5 py-1 rounded-lg border border-[#dfccc1]">
              <span className="text-[10px] text-[#82301c]/60 font-bold uppercase">Exchange:</span>
              <span className="text-[#82301c] font-bold">{slot.exchangeLanguage?.name || "N/A"}</span>
            </span>

            <span className="text-[#82301c]/40">•</span>

            <span className="text-[#82301c] font-bold">
              {slot.durationMinutes || 30} mins
            </span>
          </div>
        </div>

        {/* Right: Partner & Host Info (5 cols) - Transparent Background */}
        <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-3 p-3 rounded-2xl border border-[#dfccc1]/60">
          <div className="w-9 h-9 rounded-full bg-[#82301c]/15 text-[#82301c] border border-[#82301c]/30 flex items-center justify-center font-bold text-sm uppercase shrink-0">
            {partnerName.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#82301c]/70 tracking-wider">
              {isHost ? "Guest Partner" : "Host Partner"}
            </span>
            <span className="text-xs font-bold text-[#82301c] truncate">
              {partnerName}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Dual Ratings Display & Rating Actions */}
      <div className="pt-3 border-t border-[#dfccc1]/60 flex flex-col gap-3">
        {/* 1. GIVEN RATING (Your Rating for Partner) */}
        {givenRating ? (
          <div className="p-3.5 rounded-2xl bg-[#fffdfb] border border-[#dfccc1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-[#82301c]">
                  Your Rating for <span className="text-[#d97757] font-bold">{partnerName}</span> (as <span className="text-[#82301c] font-semibold">{givenRating.displayName || "You"}</span>):
                </span>
                <div className="flex items-center text-[#d97757] text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= givenRatingStars ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#d97757]">
                  ({givenRatingStars}/5)
                </span>
              </div>
              {givenRating.feedback && (
                <p className="text-xs text-[#5c4a44] italic font-medium">
                  &quot;{givenRating.feedback}&quot;
                </p>
              )}
            </div>

            {/* Action Buttons for Given Rating: Edit & Delete */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => onEditRating(slot, givenRating)}
                className="px-3 py-1.5 text-xs font-bold bg-[#ede0d7] text-[#82301c] border border-[#dfccc1] rounded-xl hover:bg-[#dfccc1]/50 transition cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>

              {givenRating.id && (
                <button
                  type="button"
                  onClick={() => onDeleteRating(slot.id!, givenRating.id!)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition cursor-pointer flex items-center gap-1"
                  title="Delete Rating"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#fffdfb] border border-[#dfccc1]">
            <span className="text-xs text-[#82301c]/70 font-semibold italic">
              {status === SlotStatus.COMPLETED
                ? `You have not rated ${partnerName} yet.`
                : "Rating is available after the meeting is completed."}
            </span>
            {status === SlotStatus.COMPLETED && (
              <button
                type="button"
                onClick={() => onRate(slot)}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#82301c] hover:bg-[#6c2716] text-white rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span className="text-[#d97757]">★</span>
                <span>Rate {partnerName}</span>
              </button>
            )}
          </div>
        )}

        {/* 2. RECEIVED RATING (Partner's Rating for You) */}
        {status === SlotStatus.COMPLETED && (
          <div className="p-3.5 rounded-2xl bg-[#f5e9e2]/60 border border-[#dfccc1] flex flex-col gap-1">
            {receivedRating ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-[#82301c]">
                    <span className="font-extrabold">{receivedRating.displayName || partnerName}</span>&apos;s Rating for You:
                  </span>
                  <div className="flex items-center text-[#d97757] text-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= receivedRatingStars ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#d97757]">
                    ({receivedRatingStars}/5)
                  </span>
                </div>
                {receivedRating.feedback && (
                  <p className="text-xs text-[#5c4a44] italic font-medium">
                    &quot;{receivedRating.feedback}&quot;
                  </p>
                )}
              </div>
            ) : (
              <span className="text-xs text-[#82301c]/60 font-semibold italic">
                No rating received from partner yet.
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default HistorySlotCard;
