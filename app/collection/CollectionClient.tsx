/**
 * PURPOSE:
 * Interactive Client Component for the Vocabulary Collections page.
 * Displays user collections in a responsive grid with search, language filtering,
 * date-based sorting, and default language-based sorting.
 * Optimized for 60 FPS rendering without JS layout animation conflicts.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/collection/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - initialCollections (VocabularyCollectionUncheckedCreateInput[], Required): Array of initial user collection records.
 */

"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { designTokens } from "@/app/constants/design-tokens";

interface CollectionClientProps {
  initialCollections: VocabularyCollectionUncheckedCreateInput[];
}

type SortOption = "language" | "newest" | "oldest";

interface CollectionCardProps {
  item: VocabularyCollectionUncheckedCreateInput;
  index: number;
}

/**
 * CollectionCard
 *
 * BEHAVIORAL MECHANISM:
 * Individual collection card component wrapped in React.memo.
 * Uses GPU-accelerated CSS transitions (transform, box-shadow) for hover effects
 * instead of JS framer-motion loops to eliminate lag and layout thrashing.
 */
const CollectionCard = memo(function CollectionCard({ item, index }: CollectionCardProps) {
  const wordCount = item.words?.length || 0;
  const langName = item.language?.name || "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.3), ease: "easeOut" }}
      className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} flex flex-col justify-between gap-5 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl relative group overflow-hidden`}
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
        <h3
          className={`text-lg font-bold ${designTokens.colors.text.primary} group-hover:text-sky-600 transition-colors line-clamp-1`}
        >
          {item.name}
        </h3>

        {/* Collection Description */}
        {item.description && (
          <p
            className={`text-xs ${designTokens.colors.text.secondary} line-clamp-2 leading-relaxed`}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Bottom Metadata Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
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
        <svg
          className="w-4 h-4 text-neutral-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.div>
  );
});

/**
 * CollectionClient
 *
 * BEHAVIORAL MECHANISM:
 * Orchestrates filtering and sorting of vocabulary collections.
 * Uses memoized callbacks and components to ensure silky smooth performance.
 */
export default function CollectionClient({
  initialCollections = [],
}: CollectionClientProps) {
  const [collections] = useState<VocabularyCollectionUncheckedCreateInput[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("language");

  // Extract unique available languages
  const availableLanguages = useMemo(() => {
    const langMap = new Map<string, string>();
    collections.forEach((c) => {
      if (c.language?.id && c.language?.name) {
        langMap.set(c.language.id, c.language.name);
      }
    });
    return Array.from(langMap.entries()).map(([id, name]) => ({ id, name }));
  }, [collections]);

  // Filter and sort collections
  const processedCollections = useMemo(() => {
    let result = [...collections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (selectedLanguageId !== "ALL") {
      result = result.filter((c) => c.languageId === selectedLanguageId);
    }

    result.sort((a, b) => {
      if (sortOption === "newest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortOption === "oldest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      }

      const langA = a.language?.name || "";
      const langB = b.language?.name || "";
      return langA.localeCompare(langB);
    });

    return result;
  }, [collections, searchQuery, selectedLanguageId, sortOption]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleLanguageFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageId(e.target.value);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  }, []);

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
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

          {/* Action Button: + Add */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className={`cursor-pointer px-5 py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} transition shadow-sm self-start sm:self-auto`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Collection
          </motion.button>
        </motion.div>

        {/* Filter & Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className={`p-4 sm:p-5 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col md:flex-row items-stretch md:items-center gap-4`}
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by collection name..."
              value={searchQuery}
              onChange={handleSearchChange}
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
            {/* Language Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-neutral-500 shrink-0">Language:</span>
              <select
                value={selectedLanguageId}
                onChange={handleLanguageFilterChange}
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

            {/* Sort Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-neutral-500 shrink-0">Sort by:</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className={`w-full sm:w-44 h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
              >
                <option value="language">Language (Default)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Collections Grid */}
        {processedCollections.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence initial={false}>
              {processedCollections.map((item, index) => (
                <CollectionCard key={item.id || index} item={item} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
