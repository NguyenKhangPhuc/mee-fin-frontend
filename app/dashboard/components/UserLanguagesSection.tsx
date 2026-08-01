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

const getProficiencyDetails = (prof: string) => {
  switch (prof) {
    case "ADVANCED":
      return {
        percentage: 100,
        label: "Advanced (100%)",
        barColor: "bg-[#82301c]",
        badgeStyle: "bg-[#82301c]/10 text-[#82301c] border-[#82301c]/30",
      };
    case "INTERMEDIATE":
      return {
        percentage: 66,
        label: "Intermediate (66%)",
        barColor: "bg-[#a34127]",
        badgeStyle: "bg-[#a34127]/10 text-[#a34127] border-[#a34127]/30",
      };
    default:
      return {
        percentage: 33,
        label: "Beginner (33%)",
        barColor: "bg-[#c4a99b]",
        badgeStyle: "bg-[#ebdcd3] text-[#61514d] border-[#dfccc1]",
      };
  }
};

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
      <div className={`flex flex-col gap-1 border-b ${designTokens.colors.border.default} pb-4`}>
        <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
          User Languages
        </h2>
        <p className={`text-xs ${designTokens.colors.text.muted}`}>
          Manage the languages you speak and track your proficiency progress
        </p>
      </div>

      {/* Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Languages Cards List */}
        <div className="flex flex-col gap-4">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
            My Current Languages ({userLangs.length})
          </h3>
          {userLangs.length === 0 ? (
            <div className={`p-6 border ${designTokens.colors.border.default} rounded-xl bg-[#fffdfb] text-center`}>
              <p className={`text-xs ${designTokens.colors.text.muted} italic`}>No languages added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {userLangs.map((ul) => {
                  const langObj = allLanguages.find((l) => l.id === ul.languageId);
                  const profDetails = getProficiencyDetails(ul.proficiency);

                  return (
                    <motion.div
                      key={ul.id || ul.languageId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`p-4 border ${designTokens.colors.border.default} rounded-xl bg-[#fffdfb] shadow-xs flex flex-col gap-3`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#f5e9e2] text-[#82301c] font-bold text-xs flex items-center justify-center border border-[#dfccc1]">
                            {langObj?.name?.charAt(0) || "L"}
                          </div>
                          <span className={`font-semibold text-sm ${designTokens.colors.text.primary}`}>
                            {langObj ? langObj.name : `Language (${ul.languageId})`}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md border ${profDetails.badgeStyle}`}
                        >
                          {ul.proficiency}
                        </span>
                      </div>

                      {/* Proficiency Progress Bar */}
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex justify-between items-center text-[11px] font-medium text-[#61514d]">
                          <span>Proficiency Progress</span>
                          <span className="font-semibold">{profDetails.label}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#ebdcd3] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profDetails.percentage}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${profDetails.barColor}`}
                          />
                        </div>
                      </div>
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
          className={`flex flex-col gap-4 bg-[#f8ede6]/70 p-6 border ${designTokens.colors.border.default} rounded-xl shadow-xs`}
        >
          <h3 className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
            Add New Language
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold ${designTokens.colors.text.secondary}`}>
              Select Available Language
            </label>
            <select
              value={selectedAddLangId}
              onChange={(e) => setSelectedAddLangId(e.target.value)}
              className={`h-11 px-3 border ${designTokens.colors.border.default} ${designTokens.radii.input} text-sm ${designTokens.colors.bg.input} outline-none ${designTokens.colors.border.focus} transition text-[#291e1b]`}
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
            <label className={`text-xs font-semibold ${designTokens.colors.text.secondary}`}>
              Proficiency Level
            </label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value as any)}
              className={`h-11 px-3 border ${designTokens.colors.border.default} ${designTokens.radii.input} text-sm ${designTokens.colors.bg.input} outline-none ${designTokens.colors.border.focus} transition text-[#291e1b]`}
            >
              <option value="BEGINNER">BEGINNER (33%)</option>
              <option value="INTERMEDIATE">INTERMEDIATE (66%)</option>
              <option value="ADVANCED">ADVANCED (100%)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedAddLangId || isLoading}
            className={`mt-2 h-11 px-5 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-md shadow-[#82301c]/20`}
          >
            Add Language
          </button>
        </form>
      </div>
    </>
  );
});

export default UserLanguagesSection;
