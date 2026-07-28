/**
 * PURPOSE:
 * Renders the top header section of the Community page, including the page title,
 * descriptive subtitle, and live member search bar.
 * Wrapped in React.memo to prevent re-renders when other parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx (lines 160-188).
 * Mounted as the top header of the Community page.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current value of the search filter input.
 * - onSearchChange (function, Required): Callback invoked when the user types in the search input.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";

interface CommunityHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * CommunityHeader
 *
 * BEHAVIORAL MECHANISM:
 * Displays page heading, subtitle, and controlled text input for searching members.
 * Animates into view with a subtle slide-down using framer-motion.
 */
const CommunityHeader = memo(function CommunityHeader({
  searchQuery,
  onSearchChange,
}: CommunityHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6"
    >
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
          Community Members
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${designTokens.colors.text.secondary}`}>
          Explore member profiles, academic details, and their available language exchange schedules
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-72">
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full h-10 pl-9 pr-4 text-xs sm:text-sm border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} bg-white transition shadow-xs`}
        />
        <svg
          className="w-4 h-4 absolute left-3 top-3 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </motion.div>
  );
});

export default CommunityHeader;
