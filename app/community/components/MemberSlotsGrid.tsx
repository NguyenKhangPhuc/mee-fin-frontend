/**
 * PURPOSE:
 * Displays a filterable grid of available exchange slots created by a community member,
 * sorted chronologically in ascending order. Replaces the previous FullCalendar view.
 * Includes preset filters (All, Today, Tomorrow) and a custom date picker input.
 * Client-side pagination is supported using Pagination.tsx.
 * Each slot card renders date/time, duration, status, host's provided language, and requested exchange language using inline SVG icons.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in CommunityClient.tsx right column panel beneath MemberProfileCard.
 *
 * INPUTS / PARAMETERS:
 * - memberName (string, Required): Display name of the member hosting the slots.
 * - slots (SlotUncheckedCreateInput[], Optional): Array of slot objects created by the member.
 * - onSlotClick ((slot: SlotUncheckedCreateInput) => void, Required): Event handler invoked when a user clicks a slot card.
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import Pagination from "@/app/components/Pagination";

interface MemberSlotsGridProps {
  memberName: string;
  slots?: SlotUncheckedCreateInput[];
  onSlotClick: (slot: SlotUncheckedCreateInput) => void;
}

type FilterOption = "ALL" | "TODAY" | "TOMORROW" | "CUSTOM_DATE";

/**
 * MemberSlotsGrid
 *
 * BEHAVIORAL MECHANISM:
 * Renders filter controls (All, Today, Tomorrow, Date Picker) at the top.
 * Filters the member's slots by selected date criteria, sorts them in ascending order of startTime,
 * paginates them using Pagination.tsx (6 slots per page), and renders a responsive grid of slot cards with clean SVG icons.
 *
 * PARAMETERS:
 * - props (MemberSlotsGridProps): Contains memberName, slots array, and onSlotClick callback.
 *
 * RETURNS:
 * - JSX.Element: The filterable, paginated slot grid component.
 */
const MemberSlotsGrid = memo(function MemberSlotsGrid({
  memberName,
  slots = [],
  onSlotClick,
}: MemberSlotsGridProps) {
  // Filter state
  const [filterType, setFilterType] = useState<FilterOption>("ALL");
  const [customDate, setCustomDate] = useState<string>("");

  // Pagination state (6 slots per page)
  const [slotsPage, setSlotsPage] = useState<number>(1);
  const slotsLimit = 6;

  // Reset pagination page when filters or member changes
  useEffect(() => {
    setSlotsPage(1);
  }, [filterType, customDate, memberName]);

  const handleFilterClick = useCallback((option: FilterOption) => {
    setFilterType(option);
    if (option !== "CUSTOM_DATE") {
      setCustomDate("");
    }
  }, []);

  const handleCustomDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
    setFilterType("CUSTOM_DATE");
  }, []);

  // Filter and sort slots in ascending order of startTime
  const filteredAndSortedSlots = useMemo(() => {
    let result = [...slots];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (filterType === "TODAY") {
      result = result.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === today.getTime();
      });
    } else if (filterType === "TOMORROW") {
      result = result.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === tomorrow.getTime();
      });
    } else if (filterType === "CUSTOM_DATE" && customDate) {
      const selected = new Date(customDate);
      selected.setHours(0, 0, 0, 0);
      result = result.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === selected.getTime();
      });
    }

    // Sort in ascending order of startTime
    result.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });

    return result;
  }, [slots, filterType, customDate]);

  // Client-side pagination calculations
  const totalSlotsPages = useMemo(
    () => Math.ceil(filteredAndSortedSlots.length / slotsLimit) || 1,
    [filteredAndSortedSlots.length, slotsLimit]
  );

  const currentPaginatedSlots = useMemo(() => {
    const start = (slotsPage - 1) * slotsLimit;
    return filteredAndSortedSlots.slice(start, start + slotsLimit);
  }, [filteredAndSortedSlots, slotsPage, slotsLimit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
      className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
    >
      {/* Header & Filter Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${designTokens.colors.border.default}`}>
        <div className="flex flex-col gap-0.5">
          <h3 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
            Available Slots — {memberName}
          </h3>
          <p className={`text-xs ${designTokens.colors.text.secondary}`}>
            Select a slot to book a language exchange session
          </p>
        </div>

        {/* Filter Buttons & Date Picker */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Buttons */}
          <button
            onClick={() => handleFilterClick("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-[#82301c] text-white shadow-xs"
                : "bg-[#f8ede6] text-[#82301c] hover:bg-[#f5e9e2] border border-[#dfccc1]"
            }`}
          >
            All Slots ({slots.length})
          </button>

          <button
            onClick={() => handleFilterClick("TODAY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === "TODAY"
                ? "bg-[#82301c] text-white shadow-xs"
                : "bg-[#f8ede6] text-[#82301c] hover:bg-[#f5e9e2] border border-[#dfccc1]"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => handleFilterClick("TOMORROW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === "TOMORROW"
                ? "bg-[#82301c] text-white shadow-xs"
                : "bg-[#f8ede6] text-[#82301c] hover:bg-[#f5e9e2] border border-[#dfccc1]"
            }`}
          >
            Tomorrow
          </button>

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-[#f8ede6] border border-[#dfccc1] px-2.5 py-1 rounded-lg">
            <span className="text-xs font-bold text-[#82301c]">Date:</span>
            <input
              type="date"
              value={customDate}
              onChange={handleCustomDateChange}
              className={`text-xs font-semibold ${designTokens.colors.text.primary} bg-transparent focus:outline-none cursor-pointer`}
            />
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      {filteredAndSortedSlots.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-[#dfccc1] rounded-xl bg-[#fffdfb]">
          <p className={`text-xs sm:text-sm ${designTokens.colors.text.muted} font-medium`}>
            {filterType === "ALL"
              ? "No available slots found for this member."
              : "No slots available matching the selected date filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {currentPaginatedSlots.map((slot) => {
                const startDate = new Date(slot.startTime);
                const endDate = new Date(slot.endTime);

                const dateStr = startDate.toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const startTimeStr = startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const endTimeStr = endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const isBooked = Boolean(slot.exchangeUserId) || slot.status === ("BOOKED" as any);
                const provideLangName = slot.provideLanguage?.name || "Not specified";
                const exchangeLangName = slot.exchangeLanguage?.name || "Not specified";

                return (
                  <motion.div
                    key={slot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSlotClick(slot)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col gap-3.5 relative overflow-hidden ${
                      isBooked
                        ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                        : "bg-[#fffdfb] border-[#dfccc1] hover:border-[#82301c] hover:shadow-md cursor-pointer group"
                    }`}
                  >
                    {/* Card Header: Title & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-[#82301c]">
                          {dateStr}
                        </span>
                        <h4 className={`text-sm font-bold ${designTokens.colors.text.primary} line-clamp-1`}>
                          {slot.title || "Language Exchange Session"}
                        </h4>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${
                          isBooked
                            ? "bg-gray-100 text-gray-500 border-gray-300"
                            : "bg-[#f5e9e2] text-[#82301c] border-[#dfccc1]"
                        }`}
                      >
                        {isBooked ? "Booked" : "Open"}
                      </span>
                    </div>

                    {/* Time & Duration Info with SVG Clock */}
                    <div className="flex items-center gap-2.5 bg-[#f8ede6]/70 p-2.5 rounded-xl border border-[#dfccc1]/60">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#82301c]">
                        <svg className="w-3.5 h-3.5 text-[#82301c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {startTimeStr} – {endTimeStr}
                        </span>
                      </div>
                      <span className="text-xs text-[#dfccc1]">|</span>
                      <span className="text-[11px] font-bold text-[#82301c]">
                        {slot.durationMinutes} mins
                      </span>
                    </div>

                    {/* Language Pair Badges with SVG Icons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#dfccc1]/50">
                      {/* Provides Language */}
                      <div className="flex flex-col gap-1 bg-[#f5e9e2]/50 p-2.5 rounded-lg border border-[#dfccc1]/40">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#82301c] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 8 9 8z" />
                          </svg>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#82301c]">
                            Host Teaches
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${designTokens.colors.text.primary} truncate pl-0.5`}>
                          {provideLangName}
                        </span>
                      </div>

                      {/* Exchanges Language */}
                      <div className="flex flex-col gap-1 bg-[#f5e9e2]/50 p-2.5 rounded-lg border border-[#dfccc1]/40">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-[#82301c] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#82301c]">
                            Wants to Learn
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${designTokens.colors.text.primary} truncate pl-0.5`}>
                          {exchangeLangName}
                        </span>
                      </div>
                    </div>

                    {/* Action CTA */}
                    {!isBooked && (
                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs font-bold text-[#82301c] group-hover:underline flex items-center gap-1">
                          Book Session →
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Client-Side Pagination for Member Slots Grid */}
          <Pagination
            currentPage={slotsPage}
            totalPages={totalSlotsPages}
            onPageChange={(p) => setSlotsPage(p)}
          />
        </div>
      )}
    </motion.div>
  );
});

export default MemberSlotsGrid;
