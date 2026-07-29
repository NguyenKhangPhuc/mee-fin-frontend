/**
 * PURPOSE:
 * Renders the responsive grid container displaying all processed collection cards or an empty state placeholder
 * when no collections match active search and filter criteria.
 * Wrapped in React.memo for optimized rendering performance.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - collections (VocabularyCollectionUncheckedCreateInput[], Required): Filtered and sorted array of user collections.
 * - onPlay (function, Required): Callback passed down to CollectionCard for starting the flashcard game.
 * - onEdit (function, Required): Callback passed down to CollectionCard for opening the Edit Collection modal.
 * - onManageWords (function, Required): Callback passed down to CollectionCard for opening the Words Management modal.
 */

"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { designTokens } from "@/app/constants/design-tokens";
import CollectionCard from "./CollectionCard";

interface CollectionGridProps {
  collections: VocabularyCollectionUncheckedCreateInput[];
  onPlay: (collection: VocabularyCollectionUncheckedCreateInput) => void;
  onEdit: (collection: VocabularyCollectionUncheckedCreateInput) => void;
  onManageWords: (collection: VocabularyCollectionUncheckedCreateInput) => void;
}

/**
 * CollectionGrid
 *
 * BEHAVIORAL MECHANISM:
 * Evaluates the length of the collections array parameter. If empty, renders a clean
 * fallback card informing the user. Otherwise, renders a 3-column responsive CSS grid
 * containing animated CollectionCard instances wrapped in AnimatePresence.
 *
 * PARAMETERS:
 * - props (CollectionGridProps): Contains collections list and action handlers.
 *
 * RETURNS:
 * - JSX.Element: The grid container element or empty state view.
 */
const CollectionGrid = memo(function CollectionGrid({
  collections,
  onPlay,
  onEdit,
  onManageWords,
}: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-12 text-center ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default}`}
      >
        <svg className="w-12 h-12 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>No collections found</p>
        <p className={`text-xs mt-1 ${designTokens.colors.text.secondary}`}>Try adjusting your search query or language filter</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence initial={false}>
        {collections.map((item, index) => (
          <CollectionCard
            key={item.id || index}
            item={item}
            index={index}
            onPlay={onPlay}
            onEdit={onEdit}
            onManageWords={onManageWords}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default CollectionGrid;
