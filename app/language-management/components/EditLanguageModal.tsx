/**
 * PURPOSE:
 * Renders a pop-up modal dialog to edit an existing language's name and logoUrl.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/language-management/LanguageManagementClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - language (LanguageUncheckedCreateInput | null, Required): Language record to edit.
 * - isOpen (boolean, Required): Modal visibility flag.
 * - onClose (() => void, Required): Callback to close modal.
 * - onSubmit ((id: string, name: string, logoUrl?: string) => Promise<void>, Required): Async callback invoked with updated language details.
 */

"use client";

import React, { useState, useEffect } from "react";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { designTokens } from "@/app/constants/design-tokens";

interface EditLanguageModalProps {
  language: LanguageUncheckedCreateInput | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string, logoUrl?: string) => Promise<void>;
}

export default function EditLanguageModal({
  language,
  isOpen,
  onClose,
  onSubmit,
}: EditLanguageModalProps) {
  const [name, setName] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Prepopulate form fields whenever the selected language changes or modal opens
  useEffect(() => {
    if (language) {
      setName(language.name || "");
      setLogoUrl(language.logoUrl || "");
      setValidationError(null);
    }
  }, [language, isOpen]);

  if (!isOpen || !language) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language.id) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError("Language name is required.");
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(language.id, trimmedName, logoUrl.trim() || undefined);
      onClose();
    } catch {
      // Error handling managed by parent notification toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${designTokens.loader.overlay} animate-in fade-in duration-200`}>
      <div className={`w-full max-w-md p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col gap-6 relative animate-in zoom-in-95 duration-200 select-none`}>
        {/* Close Button */}
        <button
          onClick={onClose}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Edit Language
          </h2>
          <p className={`text-xs ${designTokens.colors.text.secondary}`}>
            Update language name and logo URL for &quot;{language.name}&quot;.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
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
              placeholder="e.g. English, Vietnamese"
              disabled={isSubmitting}
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

          {/* Logo URL Field */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
              Language Logo URL <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="e.g. https://example.com/flags/en.png"
              disabled={isSubmitting}
              className={`w-full h-11 px-4 text-sm ${designTokens.colors.bg.input} ${designTokens.colors.text.primary} placeholder:${designTokens.colors.text.muted} border ${designTokens.colors.border.default} ${designTokens.radii.input} ${designTokens.colors.border.focus} outline-none transition disabled:opacity-50`}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
