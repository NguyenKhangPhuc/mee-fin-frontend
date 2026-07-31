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

import React, { useState, useEffect, useMemo, memo } from "react";
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
 * showing each rater's displayName, star rating, feedback comment, and date.
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
  console.log(profile)

  // Client-side pagination for ratingsReceived list
  const [ratingsPage, setRatingsPage] = useState<number>(1);
  const ratingsLimit = 1;

  // Reset ratings page when profile changes
  useEffect(() => {
    setRatingsPage(1);
  }, [profile.id]);

  const totalRatingsPages = useMemo(
    () => Math.ceil(ratingsReceived.length / ratingsLimit) || 1,
    [ratingsReceived.length, ratingsLimit]
  );

  const currentPaginatedRatings = useMemo(() => {
    const start = (ratingsPage - 1) * ratingsLimit;
    return ratingsReceived.slice(start, start + ratingsLimit);
  }, [ratingsReceived, ratingsPage, ratingsLimit]);

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-neutral-100">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-300 shrink-0 shadow-sm">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-neutral-600 uppercase">
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
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {profile.age} yrs
                </span>
              )}
            </div>

            {/* Rating Avg Badge Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                <span>★</span>
                <span>{ratingAvg} / 5.0</span>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
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
                  className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                >
                  Facebook
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 hover:underline font-medium flex items-center gap-1"
                >
                  Instagram
                </a>
              )}
              {profile.linkedIn && (
                <a
                  href={profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-700 hover:underline font-medium flex items-center gap-1"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Academic & Bio Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
              University
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
              {profile.university || "Not provided"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
              Programme
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
              {profile.programme || "Not provided"}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 flex flex-col gap-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
              Degree
            </span>
            <span className={`text-xs font-semibold ${designTokens.colors.text.primary} truncate`}>
              {profile.degree || "Not provided"}
            </span>
          </div>
        </div>

        {/* Description / Bio */}
        {profile.description && (
          <div className="flex flex-col gap-1 pt-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
              About
            </span>
            <p className={`text-xs leading-relaxed ${designTokens.colors.text.secondary} bg-neutral-50/60 p-3.5 rounded-lg border border-neutral-100`}>
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
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold ${designTokens.colors.text.primary}`}>
              Received Ratings & Reviews
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {ratingsReceived.length}
            </span>
          </div>
        </div>

        {ratingsReceived.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-neutral-200 rounded-xl">
            <p className="text-xs text-neutral-500 font-medium">
              No ratings received yet for this member.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {currentPaginatedRatings.map((ratingItem, idx) => {
                const raterDisplayName =
                  ratingItem.displayName ||
                  "Anonymous User";
                console.log(ratingItem)
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
                    className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/80 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-800">
                          {raterDisplayName}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= (ratingItem.rating || 0) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600">
                          ({ratingItem.rating}/5)
                        </span>
                      </div>

                      {createdDateStr && (
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {createdDateStr}
                        </span>
                      )}
                    </div>

                    {ratingItem.feedback && (
                      <p className="text-xs text-neutral-600 italic pl-1">
                        &quot;{ratingItem.feedback}&quot;
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

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
