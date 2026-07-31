/**
 * PURPOSE:
 * Pop-up modal component for creating a new rating or updating an existing rating for a meeting slot.
 * Built with react-hook-form, 1-5 star interactive selector, and Framer Motion animations.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - slot (SlotUncheckedCreateInput | null, Required): Target meeting slot object.
 * - initialRating (SlotRatingUncheckedCreateInput | null, Optional): Existing rating for editing.
 * - currentUserId (string, Required): Logged in user ID.
 * - isLoading (boolean, Required): Loader state for button disable feedback.
 * - onClose (function, Required): Callback to dismiss the modal.
 * - onSubmit (function, Required): Async callback invoked with form data on submission.
 */

"use client";

import React, { useState, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types/slot";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { designTokens } from "@/app/constants/design-tokens";

interface RatingModalProps {
  isOpen: boolean;
  slot: SlotUncheckedCreateInput | null;
  initialRating?: SlotRatingUncheckedCreateInput | null;
  currentUserId: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: RatingFormInputs) => Promise<void>;
}

export type RatingFormInputs = {
  rating: number;
  feedback: string;
};

/**
 * RatingModal
 *
 * BEHAVIORAL MECHANISM:
 * Uses react-hook-form to manage form validation for rating (1 to 5 stars) and feedback text.
 * Renders interactive star icons for selecting rating values.
 * Populates fields if initialRating exists (edit mode) or resets to default (create mode).
 *
 * PARAMETERS:
 * - props (RatingModalProps): Modal control state and submission handlers.
 *
 * RETURNS:
 * - JSX.Element: The rating modal dialog element.
 */
const RatingModal = memo(function RatingModal({
  isOpen,
  slot,
  initialRating,
  currentUserId,
  isLoading,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [selectedStar, setSelectedStar] = useState<number>(initialRating?.rating || 5);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RatingFormInputs>({
    defaultValues: {
      rating: 5,
      feedback: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const starVal = initialRating?.rating || 5;
      setSelectedStar(starVal);
      setValue("rating", starVal);
      reset({
        rating: starVal,
        feedback: initialRating?.feedback || "",
      });
    }
  }, [isOpen, initialRating, reset, setValue]);

  const handleStarClick = (val: number) => {
    setSelectedStar(val);
    setValue("rating", val, { shouldValidate: true });
  };

  const isEditMode = Boolean(initialRating?.id);

  return (
    <AnimatePresence>
      {isOpen && slot && (
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
                  {isEditMode ? "EDIT_RATING" : "RATE_MEETING"}
                </span>
                <h3 className={`text-lg font-bold ${designTokens.colors.text.primary} truncate max-w-xs sm:max-w-sm`}>
                  {isEditMode ? "Edit Rating & Feedback" : "Rate Meeting Experience"}
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Meeting Title Sub-info */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Slot: {slot.title}
                </span>
                <span className="text-xs text-neutral-600">
                  {new Date(slot.startTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Interactive Star Rating Selector */}
              <div className="flex flex-col items-center gap-2">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Your Rating
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= selectedStar;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="p-1 text-2xl transition transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <span className={isFilled ? "text-amber-400" : "text-neutral-300"}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-amber-600">
                  {selectedStar} of 5 Stars
                </span>
              </div>

              {/* Feedback Textarea */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Feedback & Review
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your language exchange experience..."
                  className={`p-3 border ${
                    errors.feedback ? designTokens.colors.border.error : designTokens.colors.border.default
                  } ${designTokens.radii.input} text-xs sm:text-sm outline-none ${designTokens.colors.border.focus} transition resize-y`}
                  {...register("feedback", { required: "Feedback is required" })}
                />
                {errors.feedback && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {errors.feedback.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
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
                  {isEditMode ? "Save Changes" : "Submit Rating"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default RatingModal;
