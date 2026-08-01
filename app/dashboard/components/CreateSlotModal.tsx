/**
 * PURPOSE:
 * Animated full-screen modal dialog for creating a new language exchange slot.
 * Wrapped in React.memo to avoid re-rendering when modal is closed or parent state changes.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 */

"use client";

import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { SlotFormInput } from "./types";

interface CreateSlotModalProps {
  isOpen: boolean;
  isLoading: boolean;
  selectedDateRange?: { start: Date; end: Date } | null;
  provideLanguageOptions: { id: string; name: string }[];
  allLanguages: LanguageUncheckedCreateInput[];
  defaultProvideLanguageId: string;
  defaultExchangeLanguageId: string;
  onClose: () => void;
  onSubmit: (data: SlotFormInput) => Promise<void>;
}

const CreateSlotModal = memo(function CreateSlotModal({
  isOpen,
  isLoading,
  selectedDateRange,
  provideLanguageOptions,
  allLanguages,
  defaultProvideLanguageId,
  defaultExchangeLanguageId,
  onClose,
  onSubmit,
}: CreateSlotModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SlotFormInput>({
    defaultValues: {
      title: "Language Exchange Slot",
      provideLanguageId: defaultProvideLanguageId,
      exchangeLanguageId: defaultExchangeLanguageId,
      durationMinutes: 30,
    },
  });

  const watchDuration = watch("durationMinutes", 30);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[#291e1b]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`w-full max-w-md ${designTokens.colors.bg.card} p-6 ${designTokens.radii.card} shadow-2xl flex flex-col gap-4 border ${designTokens.colors.border.default}`}
          >
            {/* Modal Header */}
            <div className={`flex justify-between items-center pb-3 border-b ${designTokens.colors.border.default}`}>
              <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                Create New Slot
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-[#9c8c87] hover:text-[#82301c] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Selected Time Banner */}
            {selectedDateRange && (
              <div className="flex flex-col gap-2 p-3.5 bg-[#f8ede6] border border-[#dfccc1] rounded-xl text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#61514d]">Start Time:</span>
                  <span className="font-bold text-[#82301c]">
                    {new Date(selectedDateRange.start).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#61514d]">End Time:</span>
                  <span className="font-bold text-[#82301c]">
                    {new Date(
                      new Date(selectedDateRange.start).getTime() + (Number(watchDuration) || 30) * 60000
                    ).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Slot Title */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Slot Title
                </label>
                <input
                  type="text"
                  placeholder="Slot Title"
                  className={`h-10 px-3 border ${errors.title ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.colors.bg.input} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.border.focus}`}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className={`text-xs ${designTokens.colors.text.error}`}>
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Provide Language Dropdown (ADVANCED Only) */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Provide Language (ADVANCED proficiency required)
                </label>
                {provideLanguageOptions.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
                    ⚠️ You don&apos;t have any language with <strong>ADVANCED</strong> proficiency. Add an ADVANCED language in your profile to provide slots.
                  </div>
                ) : (
                  <select
                    className={`h-10 px-3 border ${errors.provideLanguageId ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.bg.input} ${designTokens.colors.border.focus}`}
                    {...register("provideLanguageId", { required: "Provide language is required" })}
                  >
                    {provideLanguageOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Exchange Language Dropdown (All Languages) */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Exchange Language (Target language to learn)
                </label>
                <select
                  className={`h-10 px-3 border ${errors.exchangeLanguageId ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.bg.input} ${designTokens.colors.border.focus}`}
                  {...register("exchangeLanguageId", { required: "Exchange language is required" })}
                >
                  {allLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Minutes */}
              <div className="flex flex-col gap-1">
                <label className={`text-xs font-semibold ${designTokens.colors.text.primary}`}>
                  Duration (Minutes: 5-30)
                </label>
                <input
                  type="number"
                  className={`h-10 px-3 border ${errors.durationMinutes ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.colors.bg.input} ${designTokens.radii.input} text-sm outline-none ${designTokens.colors.border.focus}`}
                  {...register("durationMinutes", {
                    required: "Duration is required",
                    min: { value: 5, message: "Duration must be at least 5 minutes" },
                    max: { value: 30, message: "Duration must be at most 30 minutes" },
                  })}
                />
                {errors.durationMinutes && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.durationMinutes.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex justify-end gap-3 pt-3 border-t ${designTokens.colors.border.default}`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 h-10 border ${designTokens.colors.border.default} ${designTokens.radii.button} text-xs font-semibold text-[#61514d] hover:bg-[#ebdcd3] transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || provideLanguageOptions.length === 0}
                  className={`px-5 h-10 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-semibold disabled:opacity-50 shadow-md shadow-[#82301c]/20`}
                >
                  Create Slot
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default CreateSlotModal;
