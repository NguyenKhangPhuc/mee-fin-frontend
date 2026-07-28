/**
 * PURPOSE:
 * Renders the complete User Languages card section.
 * Wrapped in React.memo to avoid re-renders when parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 * Mounted as the User Languages card in the dashboard.
 */

"use client";

import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageUncheckedCreateInput, UserLanguageUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { getProficiencyBadgeStyle } from "./helpers";

interface UserLanguagesSectionProps {
  userLangs: UserLanguageUncheckedCreateInput[];
  allLanguages: LanguageUncheckedCreateInput[];
  isLoading: boolean;
  onAddLanguage: (
    langId: string,
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  ) => Promise<void>;
}

const UserLanguagesSection = memo(function UserLanguagesSection({
  userLangs,
  allLanguages,
  isLoading,
  onAddLanguage,
}: UserLanguagesSectionProps) {
  const [selectedAddLangId, setSelectedAddLangId] = useState<string>("");
  const [selectedProficiency, setSelectedProficiency] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  >("BEGINNER");

  const unaddedLanguages = useMemo(
    () =>
      allLanguages.filter(
        (lang) => lang.id && !userLangs.some((ul) => ul.languageId === lang.id)
      ),
    [allLanguages, userLangs]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddLangId) return;
    await onAddLanguage(selectedAddLangId, selectedProficiency);
    setSelectedAddLangId("");
  };

  return (
    <>
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-neutral-100 pb-4">
        <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
          User Languages
        </h2>
        <p className={`text-xs ${designTokens.colors.text.muted}`}>
          Manage the languages you speak and your proficiency levels
        </p>
      </div>

      {/* Two-Column Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Languages List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            My Current Languages ({userLangs.length})
          </h3>
          {userLangs.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No languages added yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {userLangs.map((ul) => {
                  const langObj = allLanguages.find((l) => l.id === ul.languageId);
                  return (
                    <motion.div
                      key={ul.id || ul.languageId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="flex items-center justify-between p-3.5 border border-neutral-200 rounded-xl bg-neutral-50/50"
                    >
                      <span className="font-semibold text-sm text-neutral-900">
                        {langObj ? langObj.name : `Language (${ul.languageId})`}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getProficiencyBadgeStyle(ul.proficiency)}`}
                      >
                        {ul.proficiency}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Add Language Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-neutral-50/50 p-5 border border-neutral-200 rounded-xl"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
            Add New Language
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">
              Select Available Language
            </label>
            <select
              value={selectedAddLangId}
              onChange={(e) => setSelectedAddLangId(e.target.value)}
              className={`h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
            >
              <option value="">-- Choose a language --</option>
              {unaddedLanguages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700">Proficiency Level</label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value as any)}
              className={`h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedAddLangId || isLoading}
            className={`mt-2 h-10 px-4 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-medium transition cursor-pointer disabled:opacity-50`}
          >
            Add Language
          </button>
        </form>
      </div>
    </>
  );
});

export default UserLanguagesSection;
