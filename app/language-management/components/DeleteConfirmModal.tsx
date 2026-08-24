/**
 * PURPOSE:
 * Renders a confirmation pop-up modal to prevent accidental deletion of a language.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/language-management/LanguageManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - language (LanguageUncheckedCreateInput | null, Required): Target language to delete or null if closed.
 * - onClose (() => void, Required): Callback to close the confirmation modal.
 * - onConfirm (() => Promise<void>, Required): Async callback to confirm deletion.
 */

import React, { useState } from "react";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { designTokens } from "@/app/constants/design-tokens";

interface DeleteConfirmModalProps {
  language: LanguageUncheckedCreateInput | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * DeleteConfirmModal
 *
 * BEHAVIORAL MECHANISM:
 * Displays a danger confirmation dialog highlighting the targeted language name.
 * Manages deleting loading state while awaiting the caller's async deletion request.
 *
 * PARAMETERS:
 * - props (DeleteConfirmModalProps): Modal target language and handler props.
 *
 * RETURNS:
 * - JSX.Element | null: Rendered modal dialog or null if no language is selected.
 */
export default function DeleteConfirmModal({
  language,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!language) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handling managed by caller via notification toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${designTokens.loader.overlay} animate-in fade-in duration-200`}>
      <div className={`w-full max-w-md p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6 animate-in zoom-in-95 duration-200`}>
        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className={`text-xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Delete Language
          </h2>
          <p className={`text-xs ${designTokens.colors.text.secondary} leading-relaxed`}>
            Are you sure you want to delete <strong className="text-red-600 font-semibold">{language.name}</strong>?
            This action will remove the language from system options.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#dfccc1]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className={`h-11 px-5 text-sm font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`h-11 px-6 text-sm font-semibold ${designTokens.colors.bg.buttonDanger} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isDeleting ? (
              <>
                <div className={`w-4 h-4 rounded-full border-2 ${designTokens.loader.spinner} animate-spin`} />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Language</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
