/**
 * PURPOSE:
 * Renders an individual language card displaying language details (name, ID, creation date)
 * and an action button to delete the language.
 *
 * CONTEXT/PARENT FILE:
 * Rendered within the grid layout in app/language-management/LanguageManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - language (LanguageUncheckedCreateInput, Required): The language data object.
 * - onRequestDelete ((language: LanguageUncheckedCreateInput) => void, Required): Callback to trigger delete confirmation.
 */

import React from "react";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { designTokens } from "@/app/constants/design-tokens";

interface LanguageCardProps {
  language: LanguageUncheckedCreateInput;
  onRequestEdit: (language: LanguageUncheckedCreateInput) => void;
  onRequestDelete: (language: LanguageUncheckedCreateInput) => void;
}

/**
 * LanguageCard
 *
 * BEHAVIORAL MECHANISM:
 * Formats language record information into a visually rich card container using designTokens styling.
 * Displays logoUrl image if present, or fallback letter avatar.
 * Provides edit and delete action buttons.
 */
export default function LanguageCard({
  language,
  onRequestEdit,
  onRequestDelete,
}: LanguageCardProps) {
  const formattedDate = language.createdAt
    ? new Date(language.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={`p-6 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} hover:border-[#82301c]/40 transition-all duration-200 flex flex-col justify-between gap-5 group`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#82301c]/10 border border-[#82301c]/20 flex items-center justify-center text-[#82301c] font-bold text-lg group-hover:bg-[#82301c] group-hover:text-white transition-colors duration-200 shadow-xs shrink-0 overflow-hidden">
            {language.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={language.logoUrl}
                alt={language.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if logoUrl image fails to load
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span>{language.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`font-bold text-lg tracking-tight ${designTokens.colors.text.primary} truncate`}>
              {language.name}
            </h3>
            {formattedDate && (
              <span className={`text-xs ${designTokens.colors.text.muted}`}>
                Added on {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`pt-4 border-t ${designTokens.colors.border.default} flex items-center justify-between text-xs gap-2`}>
        {language.id && (
          <span className={`font-mono text-[10px] ${designTokens.colors.text.muted} truncate max-w-[120px]`} title={language.id}>
            ID: {language.id}
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onRequestEdit(language)}
            className={`px-3 py-1.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} hover:bg-[#ebdcd3] transition cursor-pointer flex items-center gap-1.5`}
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onRequestDelete(language)}
            className={`px-3 py-1.5 text-xs font-semibold ${designTokens.colors.bg.buttonDanger} ${designTokens.radii.button} transition cursor-pointer flex items-center gap-1.5`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
