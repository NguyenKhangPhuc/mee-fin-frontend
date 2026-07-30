/**
 * PURPOSE:
 * Compact pop-up modal component for displaying and searching user vocabulary collections
 * directly inside the meeting room view during LiveKit calls.
 * Provides quick action buttons for editing collections and opening words management.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/room/[slotId]/RoomClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - collections (VocabularyCollectionUncheckedCreateInput[], Required): List of user collection records.
 * - onClose (function, Required): Callback to close the modal.
 * - onCreateClick (function, Required): Callback to open the Create Collection modal.
 * - onEditClick (function, Required): Callback to open the Edit Collection modal for a specific collection.
 * - onManageWordsClick (function, Required): Callback to open the Words Management modal for a specific collection.
 */

"use client";

import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { designTokens } from "@/app/constants/design-tokens";

interface RoomCollectionListModalProps {
  isOpen: boolean;
  collections: VocabularyCollectionUncheckedCreateInput[];
  onClose: () => void;
  onCreateClick: () => void;
  onEditClick: (collection: VocabularyCollectionUncheckedCreateInput) => void;
  onManageWordsClick: (collection: VocabularyCollectionUncheckedCreateInput) => void;
}

/**
 * RoomCollectionListModal
 *
 * BEHAVIORAL MECHANISM:
 * Displays a compact, dark-themed list of vocabulary collections with live search filtering.
 * Each collection row provides Edit and Words Management controls.
 * Includes a top call-to-action button to trigger collection creation.
 *
 * PARAMETERS:
 * - props (RoomCollectionListModalProps): Contains collections data and modal callbacks.
 *
 * RETURNS:
 * - JSX.Element: The compact collections list modal dialog.
 */
const RoomCollectionListModal = memo(function RoomCollectionListModal({
  isOpen,
  collections,
  onClose,
  onCreateClick,
  onEditClick,
  onManageWordsClick,
}: RoomCollectionListModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const q = searchQuery.toLowerCase();
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [collections, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-white overflow-hidden`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Vocabulary Collections
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Total: {collections.length} {collections.length === 1 ? "collection" : "collections"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Create Collection Button */}
                <button
                  type="button"
                  onClick={onCreateClick}
                  className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Collection
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search collection name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 text-xs border border-neutral-700 rounded-lg outline-none focus:border-sky-400 bg-neutral-950 text-white transition"
              />
              <svg
                className="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Compact Collections Row List */}
            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredCollections.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl">
                  <p className="text-xs text-neutral-400 font-medium">
                    No collections match your search filter.
                  </p>
                </div>
              ) : (
                filteredCollections.map((item, idx) => {
                  const wordCount = item.words?.length || 0;
                  const langName = item.language?.name || "General";

                  return (
                    <div
                      key={item.id || idx}
                      className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl hover:border-neutral-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Left: Info */}
                      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                            {langName}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 shrink-0">
                            {wordCount} {wordCount === 1 ? "word" : "words"}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-neutral-400 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => onEditClick(item)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onManageWordsClick(item)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-sky-950/80 hover:bg-sky-900/90 text-sky-300 rounded-lg border border-sky-700/60 transition cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Words
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default RoomCollectionListModal;
