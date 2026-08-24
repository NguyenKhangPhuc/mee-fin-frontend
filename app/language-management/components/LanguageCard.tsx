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
  onRequestDelete: (language: LanguageUncheckedCreateInput) => void;
}

/**
 * LanguageCard
 *
 * BEHAVIORAL MECHANISM:
 * Formats language record information into a visually rich card container using designTokens styling.
 * Provides a delete button trigger that delegates the confirmation/deletion action back to the parent orchestrator.
 *
 * PARAMETERS:
 * - props (LanguageCardProps): Contains language record and delete callback.
 *
 * RETURNS:
 * - JSX.Element: Styled language card UI component.
 */
export default function LanguageCard({
  language,
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
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#82301c]/10 border border-[#82301c]/20 flex items-center justify-center text-[#82301c] font-bold text-lg group-hover:bg-[#82301c] group-hover:text-white transition-colors duration-200 shadow-xs">
            {language.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h3 className={`font-bold text-lg tracking-tight ${designTokens.colors.text.primary}`}>
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

      <div className={`pt-4 border-t ${designTokens.colors.border.default} flex items-center justify-between text-xs`}>
        {language.id && (
          <span className={`font-mono text-[10px] ${designTokens.colors.text.muted} truncate max-w-[150px]`} title={language.id}>
            ID: {language.id}
          </span>
        )}

        <button
          onClick={() => onRequestDelete(language)}
          className={`px-3 py-1.5 text-xs font-semibold ${designTokens.colors.bg.buttonDanger} ${designTokens.radii.button} transition cursor-pointer flex items-center gap-1.5 ml-auto`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
