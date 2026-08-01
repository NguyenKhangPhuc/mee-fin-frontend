/**
 * PURPOSE:
 * Renders an individual vocabulary collection card displaying metadata, language tag,
 * word count badge, creation date, and three action buttons (Edit, Play, Words Management).
 * Redesigned to match the #82301c theme token design system.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/collection/CollectionClient.tsx.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";

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
      className="p-6 bg-[#fcf7f3] rounded-3xl shadow-sm border border-[#dfccc1] flex flex-col justify-between gap-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl relative group overflow-hidden"
    >
      {/* Top Info Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {/* Language Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
            {langName}
          </span>

          {/* Word Count Badge */}
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ede0d7] text-[#82301c] border border-[#dfccc1]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        {/* Collection Title */}
        <h3 className="text-lg font-bold text-[#82301c] group-hover:text-[#d97757] transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Collection Description */}
        {item.description && (
          <p className="text-xs text-[#5c4a44] line-clamp-2 leading-relaxed font-medium">
            {item.description}
          </p>
        )}
      </div>

      {/* Action Buttons & Metadata Footer */}
      <div className="flex flex-col gap-3 pt-4 border-t border-[#dfccc1]/60">
        <div className="flex items-center justify-between text-[11px] text-[#82301c]/70 font-medium">
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
            className="px-3 py-2 text-xs font-bold bg-[#ede0d7] text-[#82301c] border border-[#dfccc1] rounded-xl hover:bg-[#dfccc1]/50 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onPlay(item)}
            className="px-3 py-2 text-xs font-bold bg-[#82301c] hover:bg-[#6c2716] text-white rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Play</span>
          </button>
        </div>

        {/* Words Management Button */}
        <button
          type="button"
          onClick={() => onManageWords(item)}
          className="w-full py-2 px-3 text-xs font-bold text-[#82301c] bg-[#f5e9e2] border border-[#dfccc1] rounded-xl hover:bg-[#ede0d7] transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-[#d97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Words Management</span>
        </button>
      </div>
    </motion.div>
  );
});

export default CollectionCard;
