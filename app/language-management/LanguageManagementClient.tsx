/**
 * PURPOSE:
 * Client orchestrator component for managing platform languages.
 * Handles language listing in a 3-column grid, search filtering, language creation modal pop-up,
 * deletion confirmation dialogs, and toast notifications.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/language-management/page.tsx Server Component for authorized admin users.
 *
 * INPUTS / PARAMETERS:
 * - initialLanguages (LanguageUncheckedCreateInput[], Required): Pre-fetched platform languages array.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { createLanguage } from "@/app/services/language/create-language";
import { updateLanguage } from "@/app/services/language/update-language";
import { deleteLanguage } from "@/app/services/language/delete-language";
import { useNotification } from "@/app/context/NotificationContext";
import { designTokens } from "@/app/constants/design-tokens";

import LanguageHeader from "./components/LanguageHeader";
import LanguageCard from "./components/LanguageCard";
import CreateLanguageModal from "./components/CreateLanguageModal";
import EditLanguageModal from "./components/EditLanguageModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

interface LanguageManagementClientProps {
  initialLanguages: LanguageUncheckedCreateInput[];
}

export default function LanguageManagementClient({
  initialLanguages = [],
}: LanguageManagementClientProps) {
  const { showNotification } = useNotification();

  // State
  const [languages, setLanguages] = useState<LanguageUncheckedCreateInput[]>(initialLanguages);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingLanguage, setEditingLanguage] = useState<LanguageUncheckedCreateInput | null>(null);
  const [deletingLanguage, setDeletingLanguage] = useState<LanguageUncheckedCreateInput | null>(null);

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return languages;
    const query = searchQuery.toLowerCase().trim();
    return languages.filter((lang) => lang.name.toLowerCase().includes(query));
  }, [languages, searchQuery]);

  // Handle language creation
  const handleCreateLanguage = useCallback(
    async (name: string, logoUrl?: string) => {
      const { data, error } = await createLanguage({ name, logoUrl });
      if (error || !data) {
        showNotification(error || "Failed to create language", "error");
        throw new Error(error || "Failed to create language");
      }

      setLanguages((prev) => [data, ...prev]);
      showNotification(`Language "${data.name}" created successfully!`, "success");
    },
    [showNotification]
  );

  // Handle language update
  const handleUpdateLanguage = useCallback(
    async (id: string, name: string, logoUrl?: string) => {
      const { data, error } = await updateLanguage({ id, name, logoUrl });
      if (error || !data) {
        showNotification(error || "Failed to update language", "error");
        throw new Error(error || "Failed to update language");
      }

      setLanguages((prev) =>
        prev.map((lang) => (lang.id === id ? { ...lang, ...data } : lang))
      );
      showNotification(`Language "${data.name}" updated successfully!`, "success");
    },
    [showNotification]
  );

  // Handle language deletion confirm
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingLanguage || !deletingLanguage.id) return;

    const { error } = await deleteLanguage({ id: deletingLanguage.id });
    if (error) {
      showNotification(error, "error");
      throw new Error(error);
    }

    const deletedName = deletingLanguage.name;
    setLanguages((prev) => prev.filter((lang) => lang.id !== deletingLanguage.id));
    showNotification(`Language "${deletedName}" deleted successfully!`, "success");
    setDeletingLanguage(null);
  }, [deletingLanguage, showNotification]);

  return (
    <div className={`min-h-screen ${designTokens.colors.bg.page} p-4 sm:p-8 space-y-6 font-sans select-none`}>
      {/* Header Banner */}
      <LanguageHeader
        totalCount={languages.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Languages Grid */}
      {filteredLanguages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLanguages.map((language) => (
            <LanguageCard
              key={language.id || language.name}
              language={language}
              onRequestEdit={(target) => setEditingLanguage(target)}
              onRequestDelete={(target) => setDeletingLanguage(target)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className={`p-12 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col items-center justify-center text-center gap-4`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#82301c]/10 border border-[#82301c]/20 flex items-center justify-center text-[#82301c]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>

          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className={`font-bold text-lg ${designTokens.colors.text.primary}`}>
              {searchQuery ? "No matching languages" : "No languages available"}
            </h3>
            <p className={`text-xs ${designTokens.colors.text.secondary}`}>
              {searchQuery
                ? `No languages matched "${searchQuery}". Try searching with a different keyword.`
                : "Get started by adding a new language to the system."}
            </p>
          </div>

          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`mt-2 h-10 px-5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer flex items-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Language</span>
            </button>
          )}
        </div>
      )}

      {/* Pop-up Modals */}
      <CreateLanguageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLanguage}
      />

      <EditLanguageModal
        language={editingLanguage}
        isOpen={Boolean(editingLanguage)}
        onClose={() => setEditingLanguage(null)}
        onSubmit={handleUpdateLanguage}
      />

      <DeleteConfirmModal
        language={deletingLanguage}
        onClose={() => setDeletingLanguage(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
