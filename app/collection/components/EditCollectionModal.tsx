/**
 * PURPOSE:
 * Pop-up modal component for editing an existing vocabulary collection's details
 * (name, description, language). Built with react-hook-form and Framer Motion.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/collection/CollectionClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - collection (VocabularyCollectionUncheckedCreateInput | null, Required): Collection object being edited.
 * - allLanguages (LanguageUncheckedCreateInput[], Required): Available platform languages for select dropdown.
 * - isLoading (boolean, Required): Loader state for disable button feedback.
 * - onClose (function, Required): Callback to dismiss the modal.
 * - onSubmit (function, Required): Async callback invoked with form data on submission.
 */

"use client";

import React, { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { CollectionUpdatePayload } from "@/app/services/collections/update-collection";
import { designTokens } from "@/app/constants/design-tokens";

interface EditCollectionModalProps {
  isOpen: boolean;
  collection: VocabularyCollectionUncheckedCreateInput | null;
  allLanguages: LanguageUncheckedCreateInput[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CollectionUpdatePayload) => Promise<void>;
}

export type EditCollectionFormInputs = {
  name: string;
  description: string;
  languageId: string;
};

/**
 * EditCollectionModal
 *
 * BEHAVIORAL MECHANISM:
 * Uses react-hook-form to manage form state and validation for editing collection fields.
 * Resets form values whenever a new collection is selected.
 * Wrapped in AnimatePresence for smooth backdrop and scale-in animations.
 */
const EditCollectionModal = memo(function EditCollectionModal({
  isOpen,
  collection,
  allLanguages,
  isLoading,
  onClose,
  onSubmit,
}: EditCollectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCollectionFormInputs>({
    defaultValues: {
      name: "",
      description: "",
      languageId: "",
    },
  });

  // Populate form with target collection fields whenever collection prop changes
  useEffect(() => {
    if (collection) {
      reset({
        name: collection.name || "",
        description: collection.description || "",
        languageId: collection.languageId || allLanguages[0]?.id || "",
      });
    }
  }, [collection, allLanguages, reset]);

  const handleFormSubmit = async (data: EditCollectionFormInputs) => {
    if (!collection?.id || !collection?.ownerId) return;

    const payload: CollectionUpdatePayload = {
      id: collection.id,
      ownerId: collection.ownerId,
      name: data.name,
      description: data.description,
      languageId: data.languageId,
    };

    await onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && collection && (
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
                  EDIT_COLLECTION
                </span>
                <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                  Edit Collection Details
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
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              {/* Collection Name */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="Enter collection name"
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
                  placeholder="Enter collection description..."
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default EditCollectionModal;
