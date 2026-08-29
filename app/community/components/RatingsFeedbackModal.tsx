/**
 * PURPOSE:
 * Full-screen animated modal displaying received ratings and feedback for a community member.
 * Layout: 2 columns x 2 rows (4 feedbacks per page) with client-side pagination.
 * Includes star rating filtering and newest/oldest sorting controls.
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";
import Pagination from "@/app/components/Pagination";

interface RatingsFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  ratingsReceived: any[];
}

const RatingsFeedbackModal = memo(function RatingsFeedbackModal({
  isOpen,
  onClose,
  profileName,
  ratingsReceived = [],
}: RatingsFeedbackModalProps) {
  // Filter & Sort State
  const [starFilter, setStarFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Client-side pagination: 2 cols x 2 rows = 4 feedbacks per page
  const [ratingsPage, setRatingsPage] = useState<number>(1);
  const ratingsLimit = 4;

  // Reset pagination & filters whenever modal opens or ratings change
  useEffect(() => {
    if (isOpen) {
      setRatingsPage(1);
      setStarFilter("ALL");
      setSortOrder("NEWEST");
    }
  }, [isOpen, ratingsReceived]);

  const filteredAndSortedRatings = useMemo(() => {
    let list = [...ratingsReceived];

    if (starFilter !== "ALL") {
      const targetStar = Number(starFilter);
      list = list.filter((r) => r.rating === targetStar);
    }

    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "NEWEST" ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [ratingsReceived, starFilter, sortOrder]);

  const totalRatingsPages = useMemo(
    () => Math.ceil(filteredAndSortedRatings.length / ratingsLimit) || 1,
    [filteredAndSortedRatings.length, ratingsLimit]
  );

  const currentPaginatedRatings = useMemo(() => {
    const start = (ratingsPage - 1) * ratingsLimit;
    return filteredAndSortedRatings.slice(start, start + ratingsLimit);
  }, [filteredAndSortedRatings, ratingsPage, ratingsLimit]);

  const handleStarFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStarFilter(e.target.value);
    setRatingsPage(1);
  }, []);

  const handleSortOrderChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "NEWEST" | "OLDEST");
    setRatingsPage(1);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#291e1b]/40 backdrop-blur-xs select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#dfccc1] pb-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#82301c]">
                  RATINGS_&_FEEDBACK
                </span>
                <h3 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
                  Ratings & Reviews for {profileName}
                </h3>
                <p className="text-xs text-[#61514d]">
                  Total Received: <span className="font-bold text-[#82301c]">{ratingsReceived.length}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8c87] hover:text-[#82301c] hover:bg-[#ebdcd3] transition cursor-pointer shrink-0 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8ede6] p-3.5 rounded-xl border border-[#dfccc1]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#82301c]">Showing:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
                  {filteredAndSortedRatings.length} reviews
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Star Filter Dropdown */}
                <select
                  value={starFilter}
                  onChange={handleStarFilterChange}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg ${designTokens.colors.bg.input} border ${designTokens.colors.border.default} ${designTokens.colors.text.primary} focus:outline-none focus:border-[#82301c] cursor-pointer`}
                >
                  <option value="ALL">All Stars</option>
                  <option value="5">★ 5 Stars</option>
                  <option value="4">★ 4 Stars</option>
                  <option value="3">★ 3 Stars</option>
                  <option value="2">★ 2 Stars</option>
                  <option value="1">★ 1 Star</option>
                </select>

                {/* Sort Order Dropdown */}
                <select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg ${designTokens.colors.bg.input} border ${designTokens.colors.border.default} ${designTokens.colors.text.primary} focus:outline-none focus:border-[#82301c] cursor-pointer`}
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Feedback Grid (2 columns x 2 rows = 4 per page) */}
            {filteredAndSortedRatings.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#dfccc1] rounded-xl bg-[#fffdfb]">
                <p className={`text-xs ${designTokens.colors.text.muted} font-medium`}>
                  {starFilter !== "ALL"
                    ? `No ${starFilter}-star ratings found for ${profileName}.`
                    : "No ratings received yet for this member."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="wait">
                    {currentPaginatedRatings.map((ratingItem, idx) => {
                      const raterDisplayName =
                        ratingItem.displayName ||
                        ratingItem.rater?.displayName ||
                        "Anonymous User";
                      const createdDateStr = ratingItem.createdAt
                        ? new Date(ratingItem.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "";

                      return (
                        <motion.div
                          key={ratingItem.id || idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 rounded-xl bg-[#fffdfb] border border-[#dfccc1] flex flex-col gap-2.5 shadow-xs justify-between"
                        >
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#82301c] truncate">
                                {raterDisplayName}
                              </span>
                              {createdDateStr && (
                                <span className={`text-[11px] ${designTokens.colors.text.muted} font-medium shrink-0`}>
                                  {createdDateStr}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-[#d97757] text-xs">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star}>
                                    {star <= (ratingItem.rating || 0) ? "★" : "☆"}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-bold text-[#82301c]">
                                ({ratingItem.rating}/5)
                              </span>
                            </div>
                          </div>

                          {ratingItem.feedback && (
                            <p className={`text-xs ${designTokens.colors.text.secondary} italic bg-[#f8ede6]/50 p-2.5 rounded-lg border border-[#dfccc1]/40 leading-relaxed`}>
                              &quot;{ratingItem.feedback}&quot;
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls (4 items per page) */}
                {totalRatingsPages > 1 && (
                  <div className="pt-2 flex justify-center">
                    <Pagination
                      currentPage={ratingsPage}
                      totalPages={totalRatingsPages}
                      onPageChange={(p) => setRatingsPage(p)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end pt-2 border-t border-[#dfccc1]">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} hover:bg-[#ebdcd3] transition cursor-pointer`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default RatingsFeedbackModal;
