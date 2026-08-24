/**
 * PURPOSE:
 * Renders a pop-up modal dialog containing a form to input a new language name and submit it.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/language-management/LanguageManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls whether the modal is visible.
 * - onClose (() => void, Required): Callback to close the modal.
 * - onSubmit ((name: string) => Promise<void>, Required): Async callback invoked with the new language name.
 */

import React, { useState } from "react";
import { designTokens } from "@/app/constants/design-tokens";

interface CreateLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

/**
 * CreateLanguageModal
 *
 * BEHAVIORAL MECHANISM:
 * Manages an internal state for the language name input string and submission loading state.
 * Validates non-empty input before delegating the async request to the parent's onSubmit handler.
 * Clears form fields upon closing or successful creation.
 *
 * PARAMETERS:
 * - props (CreateLanguageModalProps): Modal visibility and action callback props.
 *
 * RETURNS:
 * - JSX.Element | null: Rendered modal overlay or null if closed.
 */
export default function CreateLanguageModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateLanguageModalProps) {
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError("Language name is required.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
      setName("");
      onClose();
    } catch {
      // Error handling is managed by the caller using notification toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setValidationError(null);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${designTokens.loader.overlay} animate-in fade-in duration-200`}>
      <div className={`w-full max-w-md p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6 relative animate-in zoom-in-95 duration-200`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className={`absolute top-5 right-5 p-1.5 ${designTokens.colors.text.muted} hover:${designTokens.colors.text.primary} rounded-lg hover:bg-[#ebdcd3] transition cursor-pointer disabled:opacity-50`}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1.5">
          <div className="w-10 h-10 rounded-xl bg-[#82301c]/10 border border-[#82301c]/20 flex items-center justify-center text-[#82301c]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Create New Language
          </h2>
          <p className={`text-xs ${designTokens.colors.text.secondary}`}>
            Enter the official name of the language to make it available platform-wide.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
              Language Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. English, Vietnamese, Japanese"
              disabled={isSubmitting}
              autoFocus
              className={`w-full h-11 px-4 text-sm ${designTokens.colors.bg.input} ${designTokens.colors.text.primary} placeholder:${designTokens.colors.text.muted} border ${
                validationError ? designTokens.colors.border.error : designTokens.colors.border.default
              } ${designTokens.radii.input} ${designTokens.colors.border.focus} outline-none transition disabled:opacity-50`}
            />
            {validationError && (
              <span className={`text-xs ${designTokens.colors.text.error}`}>
                {validationError}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={`h-11 px-5 text-sm font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`h-11 px-6 text-sm font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className={`w-4 h-4 rounded-full border-2 ${designTokens.loader.spinner} animate-spin`} />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Language</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
