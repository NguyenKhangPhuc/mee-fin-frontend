/**
 * PURPOSE:
 * Renders the complete User Languages card section.
 * Displays user language cards with square logo images and a custom available language selector with logo images beside titles.
 * Wrapped in React.memo to avoid re-renders when parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 * Mounted as the User Languages card in the dashboard.
 */

"use client";

import React, { useState, useMemo, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageUncheckedCreateInput, UserLanguageUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";

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
  onDeleteLanguage?: (languageId: string) => Promise<void>;
}

const UserLanguagesSection = memo(function UserLanguagesSection({
  userLangs,
  allLanguages,
  isLoading,
  onAddLanguage,
  onDeleteLanguage,
}: UserLanguagesSectionProps) {
  const [selectedAddLangId, setSelectedAddLangId] = useState<string>("");
  const [selectedProficiency, setSelectedProficiency] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  >("BEGINNER");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [deletingLangId, setDeletingLangId] = useState<string | null>(null);

  const unaddedLanguages = useMemo(
    () =>
      allLanguages.filter(
        (lang) => lang.id && !userLangs.some((ul) => ul.languageId === lang.id)
      ),
    [allLanguages, userLangs]
  );

  const selectedLangObj = useMemo(
    () => allLanguages.find((l) => l.id === selectedAddLangId),
    [allLanguages, selectedAddLangId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddLangId) return;
    await onAddLanguage(selectedAddLangId, selectedProficiency);
    setSelectedAddLangId("");
    setIsLangDropdownOpen(false);
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
                          {/* Square Logo Container */}
                          <div className="w-8 h-8 rounded-lg bg-[#f5e9e2] text-[#82301c] font-bold text-xs flex items-center justify-center border border-[#dfccc1] shrink-0 overflow-hidden shadow-xs">
                            {langObj?.logoUrl ? (
                              <Image
                                src={langObj.logoUrl}
                                alt={langObj.name || "Language logo"}
                                width={32}
                                height={32}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{langObj?.name?.charAt(0) || "L"}</span>
                            )}
                          </div>
                          <span className={`font-semibold text-sm ${designTokens.colors.text.primary}`}>
                            {langObj ? langObj.name : `Language (${ul.languageId})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${profDetails.badgeStyle}`}
                          >
                            {ul.proficiency}
                          </span>

                          {onDeleteLanguage && (
                            <button
                              type="button"
                              disabled={deletingLangId === ul.languageId}
                              onClick={async () => {
                                setDeletingLangId(ul.languageId);
                                try {
                                  await onDeleteLanguage(ul.languageId);
                                } finally {
                                  setDeletingLangId(null);
                                }
                              }}
                              className="p-1.5 rounded-lg text-[#82301c]/70 hover:text-[#82301c] hover:bg-[#82301c]/10 border border-transparent hover:border-[#82301c]/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
                              title="Delete language"
                            >
                              {deletingLangId === ul.languageId ? (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#82301c] border-t-transparent animate-spin" />
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
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

          {/* Select Available Language with Logo Image */}
          <div className="flex flex-col gap-1.5 relative">
            <label className={`text-xs font-semibold ${designTokens.colors.text.secondary}`}>
              Select Available Language
            </label>

            {/* Custom Select Box */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className={`w-full h-11 px-3 border ${designTokens.colors.border.default} ${designTokens.radii.input} text-sm ${designTokens.colors.bg.input} flex items-center justify-between outline-none ${designTokens.colors.border.focus} transition text-[#291e1b] cursor-pointer bg-[#fffdfb]`}
              >
                {selectedLangObj ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-[#f5e9e2] text-[#82301c] font-bold text-xs flex items-center justify-center border border-[#dfccc1] shrink-0 overflow-hidden">
                      {selectedLangObj.logoUrl ? (
                        <Image
                          src={selectedLangObj.logoUrl}
                          alt={selectedLangObj.name}
                          width={24}
                          height={24}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{selectedLangObj.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-semibold text-sm">{selectedLangObj.name}</span>
                  </div>
                ) : (
                  <span className="text-[#61514d]/70 text-sm">-- Choose a language --</span>
                )}
                <svg className={`w-4 h-4 text-[#82301c] shrink-0 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Custom Dropdown Options List */}
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto bg-[#fffdfb] border border-[#dfccc1] rounded-xl shadow-lg flex flex-col p-1"
                  >
                    {unaddedLanguages.length === 0 ? (
                      <div className="p-3 text-xs text-[#61514d] text-center italic">No available languages left to add</div>
                    ) : (
                      unaddedLanguages.map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddLangId(lang.id || "");
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center gap-2.5 rounded-lg hover:bg-[#f8ede6] transition text-left cursor-pointer ${
                            selectedAddLangId === lang.id ? "bg-[#f5e9e2] font-bold text-[#82301c]" : "text-[#291e1b]"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-md bg-[#f5e9e2] text-[#82301c] font-bold text-xs flex items-center justify-center border border-[#dfccc1] shrink-0 overflow-hidden">
                            {lang.logoUrl ? (
                              <Image
                                src={lang.logoUrl}
                                alt={lang.name}
                                width={24}
                                height={24}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{lang.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-semibold text-sm">{lang.name}</span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold ${designTokens.colors.text.secondary}`}>
              Proficiency Level
            </label>
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value as any)}
              className={`h-11 px-3 border ${designTokens.colors.border.default} ${designTokens.radii.input} text-sm ${designTokens.colors.bg.input} outline-none ${designTokens.colors.border.focus} transition text-[#291e1b] bg-[#fffdfb]`}
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
