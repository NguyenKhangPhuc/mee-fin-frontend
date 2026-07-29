/**
 * PURPOSE:
 * Renders the top header section of the Vocabulary Collections page, including the page title,
 * descriptive subtitle, and the primary Add Collection action button.
 * Wrapped in React.memo to prevent unnecessary re-renders when other page state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/collection/CollectionClient.tsx to modularize top-level header UI.
 * Mounted at the top of the collection grid container.
 *
 * INPUTS / PARAMETERS:
 * - onAddClick (function, Required): Callback invoked when the user clicks the Add Collection button.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";

interface CollectionHeaderProps {
  onAddClick: () => void;
}

/**
 * CollectionHeader
 *
 * BEHAVIORAL MECHANISM:
 * Displays page heading, subtitle, and primary call-to-action button for opening the Create Collection modal.
 * Animates into view with a subtle slide-down using Framer Motion.
 *
 * PARAMETERS:
 * - props (CollectionHeaderProps): Contains the onAddClick callback function.
 *
 * RETURNS:
 * - JSX.Element: The header section element for the vocabulary collection page.
 */
const CollectionHeader = memo(function CollectionHeader({
  onAddClick,
}: CollectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6"
    >
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
          Vocabulary Collections
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${designTokens.colors.text.secondary}`}>
          Organize, review, and master your language vocabulary sets
        </p>
      </div>

      {/* Action Button: + Add Collection */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddClick}
        type="button"
        className={`cursor-pointer px-5 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} transition shadow-sm self-start sm:self-auto`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Collection
      </motion.button>
    </motion.div>
  );
});

export default CollectionHeader;
