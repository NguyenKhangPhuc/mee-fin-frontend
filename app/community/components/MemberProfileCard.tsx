/**
 * PURPOSE:
 * Displays the selected community member's profile summary card and received ratings list.
 * Includes member avatar, name, age, email, rating_avg stats, academic details grid,
 * bio description, and a client-side paginated list of ratings received (showing displayName, star rating, and feedback).
 * Wrapped in React.memo for high performance.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx.
 * Mounted in the right column (lg:col-span-8) of the Community page main layout.
 *
 * INPUTS / PARAMETERS:
 * - profile (ProfileWithScore, Required): The currently selected member's profile data object.
 */

"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileWithScore } from "@/app/types/profile";
import { designTokens } from "@/app/constants/design-tokens";
import Pagination from "@/app/components/Pagination";

interface MemberProfileCardProps {
  profile: ProfileWithScore;
}

/**
 * MemberProfileCard
 *
 * BEHAVIORAL MECHANISM:
 * Renders the profile header card with avatar, average rating badge (rating_avg), social links,
 * academic info grid, and description.
 * Beneath the profile header, renders a client-side paginated list of ratingsReceived,
 * supporting star-rating filtering (5, 4, 3, 2, 1) and chronological sorting (Newest/Oldest).
 *
 * PARAMETERS:
 * - props (MemberProfileCardProps): Selected member profile object.
 *
 * RETURNS:
 * - JSX.Element: The member detail card and ratings list.
 */
const MemberProfileCard = memo(function MemberProfileCard({ profile }: MemberProfileCardProps) {
  const avatar = profile.publicAvatarUrl || profile.avatarUrl;
  const ratingAvg = Number(profile.rating_avg ?? profile.ratingAvg ?? 0).toFixed(1);
  const ratingCount = profile.rating_count ?? profile.ratingCount ?? 0;

  const ratingsReceived = useMemo(
    () => profile.ratingsReceived || [],
    [profile.ratingsReceived]
  );

  // Filter & Sort State for Ratings Received
  const [starFilter, setStarFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Client-side pagination for ratingsReceived list
  const [ratingsPage, setRatingsPage] = useState<number>(1);
  const ratingsLimit = 2;

  // Reset ratings page & filters when profile changes
  useEffect(() => {
    setRatingsPage(1);
    setStarFilter("ALL");
    setSortOrder("NEWEST");
  }, [profile.id]);

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
    <div className="flex flex-col gap-6">
      {/* Main Profile Summary Card */}
      <motion.div
        key={profile.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}
      >
        {/* Top Profile Summary */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b ${designTokens.colors.border.default}`}>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f5e9e2] text-[#82301c] overflow-hidden flex items-center justify-center border-4 border-[#dfccc1] shrink-0 shadow-md shadow-[#82301c]/10 font-bold">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl sm:text-4xl font-extrabold text-[#82301c] uppercase tracking-wider">
                {profile.fullName?.charAt(0) || profile.email?.charAt(0) || "U"}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className={`text-xl sm:text-2xl font-bold ${designTokens.colors.text.primary}`}>
                {profile.fullName || "Unnamed Member"}
              </h2>
              {profile.age && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
                  {profile.age} yrs
                </span>
              )}
            </div>

            {/* Rating Avg Badge Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-[#82301c] bg-[#f8ede6] border border-[#dfccc1] px-2.5 py-1 rounded-md shadow-xs">
                <span className="text-[#d97757]">★</span>
                <span>{ratingAvg} / 5.0</span>
              </div>
              <span className={`text-xs ${designTokens.colors.text.muted} font-medium`}>
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            </div>

            <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} mt-0.5`}>
              {profile.email}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-1">
              {profile.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#82301c] hover:underline font-semibold flex items-center gap-1"
                >
                  Facebook
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#a34127] hover:underline font-semibold flex items-center gap-1"
                >
                  Instagram
                </a>
              )}
              {profile.linkedIn && (
                <a
                  href={profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6c2716] hover:underline font-semibold flex items-center gap-1"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Academic & Bio Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col gap-0.5 shadow-xs">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              University
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.secondary} truncate`}>
              {profile.university || "Not provided"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col gap-0.5 shadow-xs">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              Programme
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.secondary} truncate`}>
              {profile.programme || "Not provided"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col gap-0.5 shadow-xs">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              Degree
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.secondary} truncate`}>
              {profile.degree || "Not provided"}
            </span>
          </div>
        </div>

        {/* Description / Bio */}
        {profile.description && (
          <div className="flex flex-col gap-1 pt-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              About
            </span>
            <p className={`text-xs leading-relaxed ${designTokens.colors.text.secondary} bg-[#f8ede6]/60 p-3.5 rounded-xl border border-[#dfccc1]`}>
              {profile.description}
            </p>
          </div>
        )}
      </motion.div>

      {/* Ratings Received List Section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        className={`p-6 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-4`}
      >
        {/* Section Header with Select Filters */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${designTokens.colors.border.default} pb-3`}>
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold ${designTokens.colors.text.primary}`}>
              Received Ratings & Reviews
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
              {filteredAndSortedRatings.length}
            </span>
          </div>

          {/* Select Dropdown Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Star Filter Select */}
            <select
              value={starFilter}
              onChange={handleStarFilterChange}
              className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${designTokens.colors.bg.input} border ${designTokens.colors.border.default} ${designTokens.colors.text.primary} focus:outline-none focus:border-[#82301c] cursor-pointer`}
            >
              <option value="ALL">All Stars</option>
              <option value="5">★ 5 Stars</option>
              <option value="4">★ 4 Stars</option>
              <option value="3">★ 3 Stars</option>
              <option value="2">★ 2 Stars</option>
              <option value="1">★ 1 Star</option>
            </select>

            {/* Sort Order Select */}
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${designTokens.colors.bg.input} border ${designTokens.colors.border.default} ${designTokens.colors.text.primary} focus:outline-none focus:border-[#82301c] cursor-pointer`}
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>

        {filteredAndSortedRatings.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#dfccc1] rounded-xl bg-[#fffdfb]">
            <p className={`text-xs ${designTokens.colors.text.muted} font-medium`}>
              {starFilter !== "ALL"
                ? `No ${starFilter}-star ratings found for this member.`
                : "No ratings received yet for this member."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <AnimatePresence mode="wait">
                {currentPaginatedRatings.map((ratingItem, idx) => {
                  const raterDisplayName =
                    ratingItem.displayName ||
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
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-xl bg-[#fffdfb] border border-[#dfccc1] flex flex-col gap-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#82301c]">
                            {raterDisplayName}
                          </span>
                          <div className="flex items-center text-[#d97757] text-xs">
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

                        {createdDateStr && (
                          <span className={`text-[11px] ${designTokens.colors.text.muted} font-medium`}>
                            {createdDateStr}
                          </span>
                        )}
                      </div>

                      {ratingItem.feedback && (
                        <p className={`text-xs ${designTokens.colors.text.secondary} italic pl-1`}>
                          &quot;{ratingItem.feedback}&quot;
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Client-Side Pagination Controls for Ratings Received */}
            <Pagination
              currentPage={ratingsPage}
              totalPages={totalRatingsPages}
              onPageChange={(p) => setRatingsPage(p)}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
});

export default MemberProfileCard;
