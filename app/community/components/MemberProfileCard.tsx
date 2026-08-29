/**
 * PURPOSE:
 * Displays the selected community member's profile summary card and received ratings list.
 * Includes member avatar, name, age, email, rating_avg stats, academic details grid,
 * bio description, and a client-side paginated list of ratings received (showing displayName, star rating, and feedback).
 * Ratings list is hidden by default and toggled via "View ratings and feedback" button.
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

import React, { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { ProfileWithScore } from "@/app/types/profile";
import { designTokens } from "@/app/constants/design-tokens";
import RatingsFeedbackModal from "./RatingsFeedbackModal";

interface MemberProfileCardProps {
  profile: ProfileWithScore;
}

/**
 * MemberProfileCard
 *
 * BEHAVIORAL MECHANISM:
 * Renders the profile header card with avatar, average rating badge (rating_avg), social links,
 * academic info grid, description, and a button "View the ratings and feedback" that opens RatingsFeedbackModal.
 *
 * PARAMETERS:
 * - props (MemberProfileCardProps): Selected member profile object.
 *
 * RETURNS:
 * - JSX.Element: The member detail card and RatingsFeedbackModal.
 */
const MemberProfileCard = memo(function MemberProfileCard({ profile }: MemberProfileCardProps) {
  const avatar = profile.publicAvatarUrl || profile.avatarUrl;
  const ratingAvg = Number(profile.rating_avg ?? profile.ratingAvg ?? 0).toFixed(1);
  const ratingCount = profile.rating_count ?? profile.ratingCount ?? 0;

  const ratingsReceived = useMemo(
    () => profile.ratingsReceived || [],
    [profile.ratingsReceived]
  );

  // Modal state for Ratings & Feedback (default: closed)
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState<boolean>(false);

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

        {/* Button to Open Ratings and Feedback Modal */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsRatingsModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#f8ede6] hover:bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1] text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
          >
            <span>View the ratings and feedback</span>
            <span className="px-2 py-0.5 rounded-full bg-[#82301c] text-white text-[10px] font-extrabold">
              {ratingsReceived.length}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Ratings & Feedback Modal */}
      <RatingsFeedbackModal
        isOpen={isRatingsModalOpen}
        onClose={() => setIsRatingsModalOpen(false)}
        profileName={profile.fullName || profile.email || "Member"}
        ratingsReceived={ratingsReceived}
      />
    </div>
  );
});

export default MemberProfileCard;
