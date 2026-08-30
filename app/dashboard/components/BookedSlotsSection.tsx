/**
 * PURPOSE:
 * Displays a 2x2 grid of the user's booked slots (status === SlotStatus.BOOKED) positioned above the FullCalendar.
 * Reuses SlotDetailModal upon clicking a slot card.
 * Supports client-side pagination (4 items per page) with Pagination.tsx and natural height adjustment (h-auto).
 */

"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput, LanguageUncheckedCreateInput } from "@/app/types";
import { SlotStatus } from "@/app/types/enum";
import { designTokens } from "@/app/constants/design-tokens";
import Pagination from "@/app/components/Pagination";

export interface BookedSlotItem {
  slot: SlotUncheckedCreateInput;
  isOwner: boolean;
  status: SlotStatus;
}

interface BookedSlotsSectionProps {
  bookedSlots: BookedSlotItem[];
  allLanguages?: LanguageUncheckedCreateInput[];
  onSelectSlot: (detail: BookedSlotItem) => void;
}

const BookedSlotsSection = memo(function BookedSlotsSection({
  bookedSlots = [],
  allLanguages = [],
  onSelectSlot,
}: BookedSlotsSectionProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // 2 cols x 2 rows = 4 slots per page

  const totalPages = useMemo(
    () => Math.ceil(bookedSlots.length / itemsPerPage) || 1,
    [bookedSlots.length, itemsPerPage]
  );

  const paginatedSlots = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return bookedSlots.slice(start, start + itemsPerPage);
  }, [bookedSlots, currentPage, itemsPerPage]);

  const getLanguageName = useCallback(
    (langObj?: any, langId?: string) => {
      if (langObj && langObj.name) return langObj.name;
      if (!langId) return "Any Language";
      const found = allLanguages.find((l) => l.id === langId);
      return found ? found.name : "Language";
    },
    [allLanguages]
  );

  return (
    <div className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6 font-sans`}>
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${designTokens.colors.border.default} pb-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1] flex items-center justify-center font-bold shadow-xs">
            📅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
                Booked Language Sessions
              </h2>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#82301c] text-white shadow-xs">
                {bookedSlots.length}
              </span>
            </div>
            <p className={`text-xs ${designTokens.colors.text.secondary} mt-0.5`}>
              Confirmed upcoming exchange appointments
            </p>
          </div>
        </div>
      </div>

      {/* Grid Body */}
      {bookedSlots.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-[#dfccc1] rounded-2xl bg-[#fffdfb] flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-semibold text-[#82301c]">No Booked Sessions Found</p>
          <p className={`text-xs ${designTokens.colors.text.muted} max-w-sm`}>
            Explore community slots to book your next language exchange session, or publish slots for others to book!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
            <AnimatePresence mode="wait">
              {paginatedSlots.map(({ slot, isOwner, status }) => {
                const provideName = getLanguageName(slot.provideLanguage, slot.provideLanguageId);
                const exchangeName = getLanguageName(slot.exchangeLanguage, slot.exchangeLanguageId);

                const startTimeStr = slot.startTime
                  ? new Date(slot.startTime).toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) +
                    " • " +
                    new Date(slot.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Scheduled Time";

                const durationStr = slot.durationMinutes
                  ? `${slot.durationMinutes} mins`
                  : "30 mins";

                return (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectSlot({ slot, isOwner, status })}
                    className="p-5 rounded-2xl bg-[#fffdfb] border border-[#dfccc1] hover:border-[#82301c] transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between gap-4 group"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#82301c] group-hover:text-[#6c2716] transition line-clamp-1">
                          {slot.title || "Language Exchange Session"}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 uppercase tracking-wider">
                          BOOKED
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#61514d]">
                        <svg className="w-4 h-4 text-[#82301c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{startTimeStr} ({durationStr})</span>
                      </div>
                    </div>

                    {/* Language Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#dfccc1]/60 text-xs">
                      <div className="flex flex-col gap-0.5 bg-[#f8ede6] p-2 rounded-xl border border-[#dfccc1]">
                        <span className="text-[9px] font-extrabold uppercase text-[#82301c]">Host Offers</span>
                        <span className="font-bold text-[#291e1b] truncate">{provideName}</span>
                      </div>

                      <div className="flex flex-col gap-0.5 bg-[#f8ede6] p-2 rounded-xl border border-[#dfccc1]">
                        <span className="text-[9px] font-extrabold uppercase text-[#d97757]">Wants Exchange</span>
                        <span className="font-bold text-[#291e1b] truncate">{exchangeName}</span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-[#82301c] bg-[#f5e9e2] px-2 py-0.5 rounded-md border border-[#dfccc1]">
                        {isOwner ? "👑 Your Slot (Host)" : "🤝 Joined Session"}
                      </span>
                      <span className="text-xs font-bold text-[#82301c] group-hover:underline flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-2 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default BookedSlotsSection;
