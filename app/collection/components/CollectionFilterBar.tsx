/**
 * PURPOSE:
 * Renders the filter and sort control bar for the Vocabulary Collections page,
 * containing a search input field, language filter select dropdown, and sorting criteria select dropdown.
 * Wrapped in React.memo to prevent unnecessary re-renders when other parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current search query string.
 * - selectedLanguageId (string, Required): Selected language filter ID or "ALL".
 * - sortOption ("language" | "newest" | "oldest", Required): Selected sorting order option.
 * - availableLanguages (Array<{ id: string; name: string }>, Required): Unique list of languages available for filtering.
 * - onSearchChange (function, Required): Callback invoked when typing in the search input.
 * - onLanguageFilterChange (function, Required): Callback invoked when selecting a language filter option.
 * - onSortChange (function, Required): Callback invoked when selecting a sorting criteria option.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";

export type SortOption = "language" | "newest" | "oldest";

interface CollectionFilterBarProps {
  searchQuery: string;
  selectedLanguageId: string;
  sortOption: SortOption;
  availableLanguages: { id: string; name: string }[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLanguageFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * CollectionFilterBar
 *
 * BEHAVIORAL MECHANISM:
 * Displays search bar input, language filter dropdown, and sort criteria dropdown.
 * Animates into view with a subtle slide-down motion using Framer Motion.
 *
 * PARAMETERS:
 * - props (CollectionFilterBarProps): Filter states, dropdown options, and event change callbacks.
 *
 * RETURNS:
 * - JSX.Element: The filter and sort controls container element.
 */
const CollectionFilterBar = memo(function CollectionFilterBar({
  searchQuery,
  selectedLanguageId,
  sortOption,
  availableLanguages,
  onSearchChange,
  onLanguageFilterChange,
  onSortChange,
}: CollectionFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      className={`p-4 sm:p-5 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col md:flex-row items-stretch md:items-center gap-4`}
    >
      {/* Search Bar Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by collection name..."
          value={searchQuery}
          onChange={onSearchChange}
          className={`w-full h-10 pl-9 pr-4 text-xs sm:text-sm border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} bg-white transition shadow-xs`}
        />
        <svg
          className="w-4 h-4 absolute left-3 top-3 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filter Group */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Language Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-neutral-500 shrink-0">Language:</span>
          <select
            value={selectedLanguageId}
            onChange={onLanguageFilterChange}
            className={`w-full sm:w-44 h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
          >
            <option value="ALL">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-neutral-500 shrink-0">Sort by:</span>
          <select
            value={sortOption}
            onChange={onSortChange}
            className={`w-full sm:w-44 h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
          >
            <option value="language">Language (Default)</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
});

export default CollectionFilterBar;
