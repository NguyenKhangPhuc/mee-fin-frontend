/**
 * PURPOSE:
 * Renders the top header section for the Language Management page including title, search bar,
 * count badge, and trigger button to open the language creation modal.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/language-management/LanguageManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - totalCount (number, Required): Total number of languages currently loaded.
 * - searchQuery (string, Required): Current search query value.
 * - onSearchChange ((query: string) => void, Required): Callback to update search query.
 * - onOpenCreateModal (() => void, Required): Callback to trigger create modal open.
 */

import React from "react";
import { designTokens } from "@/app/constants/design-tokens";

interface LanguageHeaderProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
}

/**
 * LanguageHeader
 *
 * BEHAVIORAL MECHANISM:
 * Displays a styled card container matching designTokens, presenting header metrics,
 * a real-time search input for filtering languages, and a primary CTA button to open the create modal.
 *
 * PARAMETERS:
 * - props (LanguageHeaderProps): Props containing counts, search handlers, and modal opener callback.
 *
 * RETURNS:
 * - JSX.Element: Header UI element.
 */
export default function LanguageHeader({
  totalCount,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}: LanguageHeaderProps) {
  return (
    <div
      className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}
          >
            Language Management
          </h1>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#82301c]/10 text-[#82301c] border border-[#82301c]/20"
          >
            {totalCount} {totalCount === 1 ? "Language" : "Languages"}
          </span>
        </div>
        <p className={`text-sm ${designTokens.colors.text.secondary}`}>
          Manage system-supported languages available across language exchange slots and vocabulary collections.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search language name..."
            className={`w-full h-11 pl-10 pr-4 text-sm ${designTokens.colors.bg.input} ${designTokens.colors.text.primary} placeholder:${designTokens.colors.text.muted} border ${designTokens.colors.border.default} ${designTokens.radii.input} ${designTokens.colors.border.focus} outline-none transition`}
          />
          <svg
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${designTokens.colors.text.muted}`}
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

        {/* Create Language Button */}
        <button
          onClick={onOpenCreateModal}
          className={`h-11 px-5 text-sm font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} transition cursor-pointer flex items-center justify-center gap-2 shrink-0`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Language</span>
        </button>
      </div>
    </div>
  );
}
