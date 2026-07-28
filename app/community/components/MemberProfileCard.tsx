/**
 * PURPOSE:
 * Displays the selected community member's profile summary card.
 * Includes member avatar, name, age, email, social links, academic details grid,
 * and bio description.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 256-368).
 * Mounted in the right column (lg:col-span-8) of the Community page main layout.
 *
 * INPUTS / PARAMETERS:
 * - profile (ProfileUncheckedCreateInput, Required): The currently selected member's profile data object.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { ProfileUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";

interface MemberProfileCardProps {
  profile: ProfileUncheckedCreateInput;
}

/**
 * MemberProfileCard
 *
 * BEHAVIORAL MECHANISM:
 * Renders the profile header card with avatar, social links, university/degree grid,
 * and description. Uses framer-motion to apply a smooth fade-in and scale animation
 * whenever a new member is selected.
 */
const MemberProfileCard = memo(function MemberProfileCard({ profile }: MemberProfileCardProps) {
  const avatar = profile.publicAvatarUrl || profile.avatarUrl;

  return (
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

        <div className="flex flex-col gap-1 min-w-0 flex-1">
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
          <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary}`}>
            {profile.email}
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 mt-2">
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
  );
});

export default MemberProfileCard;
