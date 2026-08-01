/**
 * PURPOSE:
 * Renders the top header section of the Vocabulary Collections page, including the page title,
 * descriptive subtitle, and the primary Add Collection action button.
 * Redesigned to match the #82301c theme tokens and design system.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at the top of app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - onAddClick (function, Required): Callback invoked when the user clicks the Add Collection button.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface CollectionHeaderProps {
  onAddClick: () => void;
}

/**
 * CollectionHeader
 *
 * BEHAVIORAL MECHANISM:
 * Displays page heading, subtitle, and primary call-to-action button for opening the Create Collection modal.
 * Animates into view with a subtle slide-down using Framer Motion.
 */
const CollectionHeader = memo(function CollectionHeader({
  onAddClick,
}: CollectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfccc1] pb-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#82301c]">
          Vocabulary Collections
        </h1>
        <p className="text-xs sm:text-sm mt-1 text-[#82301c]/80 font-medium">
          Organize, review, and master your language vocabulary sets
        </p>
      </div>

      {/* Action Button: + Add Collection */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddClick}
        type="button"
        className="cursor-pointer px-5 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-[#82301c] hover:bg-[#6c2716] text-white rounded-xl shadow-md shadow-[#82301c]/20 transition border border-[#82301c] self-start sm:self-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Collection</span>
      </motion.button>
    </motion.div>
  );
});

export default CollectionHeader;
