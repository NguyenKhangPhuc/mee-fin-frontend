/**
 * PURPOSE:
 * Pop-up modal component for creating a new vocabulary collection.
 * Built with react-hook-form and Framer Motion.
 * Redesigned to match the #82301c theme token design system.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/collection/CollectionClient.tsx.
 */

"use client";

import React, { useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageUncheckedCreateInput } from "@/app/types/language";

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none font-sans"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md bg-[#fcf7f3] rounded-3xl border border-[#dfccc1] p-6 sm:p-7 flex flex-col gap-5 shadow-2xl text-[#82301c]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#dfccc1] pb-3.5">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#d97757]">
                  NEW_COLLECTION
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[#82301c]">
                  Create Collection
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#82301c]/60 hover:text-[#82301c] hover:bg-[#ede0d7] transition cursor-pointer font-bold text-sm"
                title="Close Modal"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Collection Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#82301c]">
                  Collection Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spanish Travel Words"
                  {...register("name", { required: "Collection name is required" })}
                  className="w-full h-10 px-3.5 text-xs sm:text-sm border border-[#dfccc1] rounded-xl outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition"
                />
                {errors.name && (
                  <span className="text-[11px] font-semibold text-rose-600">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Target Language Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#82301c]">
                  Target Language <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("languageId", { required: "Target language is required" })}
                  className="w-full h-10 px-3.5 text-xs sm:text-sm border border-[#dfccc1] rounded-xl outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] font-medium cursor-pointer transition"
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                {errors.languageId && (
                  <span className="text-[11px] font-semibold text-rose-600">
                    {errors.languageId.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#82301c]">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Short summary of this vocabulary set..."
                  {...register("description")}
                  className="w-full p-3 text-xs sm:text-sm border border-[#dfccc1] rounded-xl outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition resize-none"
                />
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dfccc1]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#82301c] bg-[#ede0d7] hover:bg-[#dfccc1]/50 border border-[#dfccc1] rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#82301c] hover:bg-[#6c2716] rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>{isLoading ? "Creating..." : "Create Collection"}</span>
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
