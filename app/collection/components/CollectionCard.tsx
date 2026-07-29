/**
 * PURPOSE:
 * Renders an individual vocabulary collection card displaying metadata, language tag,
 * word count badge, creation date, and three action buttons (Edit, Play, Words Management).
 * Wrapped in React.memo for high-performance grid rendering.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - item (VocabularyCollectionUncheckedCreateInput, Required): The collection data record.
 * - index (number, Required): Position index used for Framer Motion stagger delay calculation.
 * - onPlay (function, Required): Callback to start studying the collection with flashcards.
 * - onEdit (function, Required): Callback to open the Edit Collection modal dialog.
 * - onManageWords (function, Required): Callback to open the Words Management modal dialog.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { designTokens } from "@/app/constants/design-tokens";

interface CollectionCardProps {
  item: VocabularyCollectionUncheckedCreateInput;
  index: number;
  onPlay: (collection: VocabularyCollectionUncheckedCreateInput) => void;
  onEdit: (collection: VocabularyCollectionUncheckedCreateInput) => void;
  onManageWords: (collection: VocabularyCollectionUncheckedCreateInput) => void;
}

/**
 * CollectionCard
 *
 * BEHAVIORAL MECHANISM:
 * Renders an individual collection card with metadata, word count, language tag,
 * and action buttons. Uses GPU-accelerated CSS transitions for hover elevation
 * and Framer Motion stagger delay for entry animation.
 *
 * PARAMETERS:
 * - props (CollectionCardProps): Contains collection item data, index, and action callbacks.
 *
 * RETURNS:
 * - JSX.Element: The collection card item element.
 */
const CollectionCard = memo(function CollectionCard({
  item,
  index,
  onPlay,
  onEdit,
  onManageWords,
}: CollectionCardProps) {
  const wordCount = item.words?.length || 0;
  const langName = item.language?.name || "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
      className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} flex flex-col justify-between gap-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl relative group overflow-hidden`}
    >
      {/* Top Info Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {/* Language Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200/80">
            {langName}
          </span>

          {/* Word Count Badge */}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        {/* Collection Title */}
        <h3 className={`text-lg font-bold ${designTokens.colors.text.primary} group-hover:text-sky-600 transition-colors line-clamp-1`}>
          {item.name}
        </h3>

        {/* Collection Description */}
        {item.description && (
          <p className={`text-xs ${designTokens.colors.text.secondary} line-clamp-2 leading-relaxed`}>
            {item.description}
          </p>
        )}
      </div>

      {/* Action Buttons & Metadata Footer */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>
            Created:{" "}
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>

        {/* Edit and Play Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className={`px-3 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer flex items-center justify-center gap-1.5`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            type="button"
            onClick={() => onPlay(item)}
            className={`px-3 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play
          </button>
        </div>

        {/* Words Management Button */}
        <button
          type="button"
          onClick={() => onManageWords(item)}
          className="w-full py-2 px-3 text-xs font-semibold text-sky-700 bg-sky-50/80 border border-sky-200/80 rounded-lg hover:bg-sky-100/80 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Words Management
        </button>
      </div>
    </motion.div>
  );
});

export default CollectionCard;
