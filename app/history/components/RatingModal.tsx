/**
 * PURPOSE:
 * Pop-up modal component for creating a new rating or updating an existing rating for a meeting slot.
 * Built with react-hook-form, 1-5 star interactive selector, display name selector (User Display Name vs Anonymous User),
 * and Framer Motion animations.
 * Redesigned to match the #82301c theme token design system.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/history/HistoryClient.tsx.
 */

"use client";

import React, { useState, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { SlotUncheckedCreateInput } from "@/app/types/slot";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";

interface RatingModalProps {
  isOpen: boolean;
  slot: SlotUncheckedCreateInput | null;
  initialRating?: SlotRatingUncheckedCreateInput | null;
  currentUserId: string;
  currentUserDisplayName?: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: RatingFormInputs) => Promise<void>;
}

export type RatingFormInputs = {
  rating: number;
  feedback: string;
  displayName: string;
};

/**
 * RatingModal
 *
 * BEHAVIORAL MECHANISM:
 * Uses react-hook-form to manage form validation for rating (1 to 5 stars), feedback text,
 * and display name preference (User Display Name or "Anonymous User").
 * Styled with theme #82301c tokens and warm surface palette.
 */
const RatingModal = memo(function RatingModal({
  isOpen,
  slot,
  initialRating,
  currentUserId,
  currentUserDisplayName,
  isLoading,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [selectedStar, setSelectedStar] = useState<number>(initialRating?.rating || 5);

  const realDisplayName = currentUserDisplayName || "User";
  const anonymousOption = "Anonymous User";

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
      displayName: realDisplayName,
    },
  });

  useEffect(() => {
    if (isOpen) {
      const starVal = initialRating?.rating || 5;
      const initialName = initialRating?.displayName || realDisplayName;

      setSelectedStar(starVal);
      setValue("rating", starVal);
      reset({
        rating: starVal,
        feedback: initialRating?.feedback || "",
        displayName: initialName,
      });
    }
  }, [isOpen, initialRating, realDisplayName, reset, setValue]);

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
                  {isEditMode ? "EDIT_RATING" : "RATE_MEETING"}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[#82301c] truncate max-w-xs sm:max-w-sm">
                  {isEditMode ? "Edit Rating & Feedback" : "Rate Meeting Experience"}
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Meeting Title Sub-info */}
              <div className="p-3.5 rounded-2xl bg-[#f5e9e2]/60 border border-[#dfccc1] flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[#82301c] uppercase tracking-wider truncate">
                  Slot: {slot.title}
                </span>
                <span className="text-xs text-[#5c4a44] font-semibold">
                  {new Date(slot.startTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Display Name Identity Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#82301c]">
                  Show Name As
                </label>
                <select
                  className="w-full h-10 px-3.5 border border-[#dfccc1] rounded-xl text-xs sm:text-sm bg-[#fffdfb] text-[#82301c] font-medium outline-none focus:border-[#82301c] cursor-pointer transition"
                  {...register("displayName", { required: "Display name is required" })}
                >
                  <option value={realDisplayName}>{realDisplayName} (Display Name)</option>
                  <option value={anonymousOption}>Anonymous User</option>
                </select>
              </div>

              {/* Interactive Star Rating Selector */}
              <div className="flex flex-col items-center gap-2">
                <label className="text-xs font-bold text-[#82301c]">
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
                        <span className={isFilled ? "text-[#d97757]" : "text-[#dfccc1]"}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-[#d97757]">
                  {selectedStar} of 5 Stars
                </span>
              </div>

              {/* Feedback Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#82301c]">
                  Feedback & Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your language exchange experience..."
                  className="p-3 border border-[#dfccc1] rounded-xl text-xs sm:text-sm outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition resize-y"
                  {...register("feedback", { required: "Feedback is required" })}
                />
                {errors.feedback && (
                  <p className="text-[11px] font-semibold text-rose-600">
                    {errors.feedback.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
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
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isEditMode ? "Save Changes" : "Submit Rating"}</span>
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
