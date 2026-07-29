/**
 * PURPOSE:
 * Pop-up modal component for creating a new vocabulary collection.
 * Built with react-hook-form and Framer Motion.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - allLanguages (LanguageUncheckedCreateInput[], Required): Available platform languages for select dropdown.
 * - isLoading (boolean, Required): Loader state for disable button feedback.
 * - onClose (function, Required): Callback to dismiss the modal.
 * - onSubmit (function, Required): Async callback invoked with form data on submission.
 */

"use client";

import React, { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { designTokens } from "@/app/constants/design-tokens";

interface CreateCollectionModalProps {
  isOpen: boolean;
  allLanguages: LanguageUncheckedCreateInput[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCollectionFormInputs) => Promise<void>;
}

export type CreateCollectionFormInputs = {
  name: string;
  description: string;
  languageId: string;
};

/**
 * CreateCollectionModal
 *
 * BEHAVIORAL MECHANISM:
 * Uses react-hook-form to manage form state and validation for creating a collection.
 * Resets form values when the modal opens.
 * Wrapped in AnimatePresence for smooth backdrop and scale-in animations.
 */
const CreateCollectionModal = memo(function CreateCollectionModal({
  isOpen,
  allLanguages,
  isLoading,
  onClose,
  onSubmit,
}: CreateCollectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCollectionFormInputs>({
    defaultValues: {
      name: "",
      description: "",
      languageId: allLanguages[0]?.id || "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        languageId: allLanguages[0]?.id || "",
      });
    }
  }, [isOpen, allLanguages, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-5`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  NEW_COLLECTION
                </span>
                <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                  Create New Collection
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Collection Name */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spanish Travel Phrases"
                  className={`h-10 px-3.5 border ${
                    errors.name ? designTokens.colors.border.error : designTokens.colors.border.default
                  } ${designTokens.radii.input} text-xs sm:text-sm outline-none ${designTokens.colors.border.focus} transition`}
                  {...register("name", { required: "Collection name is required" })}
                />
                {errors.name && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Language Selection */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Language
                </label>
                <select
                  className={`h-10 px-3 border ${
                    errors.languageId ? designTokens.colors.border.error : designTokens.colors.border.default
                  } ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus} transition`}
                  {...register("languageId", { required: "Language is required" })}
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                {errors.languageId && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {errors.languageId.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what vocabulary words this set contains..."
                  className={`p-3 border ${designTokens.colors.border.default} ${designTokens.radii.input} text-xs sm:text-sm outline-none ${designTokens.colors.border.focus} transition resize-y`}
                  {...register("description")}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Collection
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default CreateCollectionModal;
