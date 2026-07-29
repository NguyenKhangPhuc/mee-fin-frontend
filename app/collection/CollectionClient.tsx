/**
 * PURPOSE:
 * Lean orchestrator client component for the Vocabulary Collections page.
 * Manages collection state, filters, sorting criteria, modal visibilities,
 * and service API calls, while delegating UI rendering to modular sub-components in app/collection/components/.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/collection/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - initialCollections (VocabularyCollectionUncheckedCreateInput[], Required): Initial user collection records.
 * - allLanguages (LanguageUncheckedCreateInput[], Optional): Available platform languages.
 * - currentUser (SafeUser | null, Optional): Authenticated user session object.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { SafeUser } from "@/app/types/authentication";
import { updateCollection, CollectionUpdatePayload } from "@/app/services/collections/update-collection";
import { createCollection } from "@/app/services/collections/create-collection";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

import WordFlashCards from "./components/WordFlashCards";
import EditCollectionModal from "./components/EditCollectionModal";
import CreateCollectionModal, { CreateCollectionFormInputs } from "./components/CreateCollectionModal";
import WordsManagementModal from "./components/WordsManagementModal";
import CollectionHeader from "./components/CollectionHeader";
import CollectionFilterBar, { SortOption } from "./components/CollectionFilterBar";
import CollectionGrid from "./components/CollectionGrid";

interface CollectionClientProps {
  initialCollections: VocabularyCollectionUncheckedCreateInput[];
  allLanguages?: LanguageUncheckedCreateInput[];
  currentUser?: SafeUser | null;
}

/**
 * CollectionClient
 *
 * BEHAVIORAL MECHANISM:
 * Serves as the primary state container for vocabulary collections.
 * Uses useMemo for search filtering and sorting so that typing in the search bar
 * re-computes only the memoized processedCollections list.
 * Uses useCallback for all event handlers passed down to memoized child components.
 *
 * PARAMETERS:
 * - props (CollectionClientProps): Contains initialCollections, allLanguages, and currentUser.
 *
 * RETURNS:
 * - JSX.Element: The collection page layout with header, filter bar, card grid, and modals.
 */
export default function CollectionClient({
  initialCollections = [],
  allLanguages = [],
  currentUser,
}: CollectionClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader, isOpenLoader } = useLoader();

  // State
  const [collections, setCollections] = useState<VocabularyCollectionUncheckedCreateInput[]>(initialCollections);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("language");

  // Game & Modal state
  const [playingCollection, setPlayingCollection] = useState<VocabularyCollectionUncheckedCreateInput | null>(null);
  const [editingCollection, setEditingCollection] = useState<VocabularyCollectionUncheckedCreateInput | null>(null);
  const [managingWordsCollection, setManagingWordsCollection] = useState<VocabularyCollectionUncheckedCreateInput | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Extract unique available languages for filter dropdown
  const filterLanguages = useMemo(() => {
    const langMap = new Map<string, string>();
    collections.forEach((c) => {
      if (c.language?.id && c.language?.name) {
        langMap.set(c.language.id, c.language.name);
      }
    });
    return Array.from(langMap.entries()).map(([id, name]) => ({ id, name }));
  }, [collections]);

  // Filter and sort collections
  const processedCollections = useMemo(() => {
    let result = [...collections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (selectedLanguageId !== "ALL") {
      result = result.filter((c) => c.languageId === selectedLanguageId);
    }

    result.sort((a, b) => {
      if (sortOption === "newest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortOption === "oldest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      }

      const langA = a.language?.name || "";
      const langB = b.language?.name || "";
      return langA.localeCompare(langB);
    });

    return result;
  }, [collections, searchQuery, selectedLanguageId, sortOption]);

  /**
   * handleSearchChange
   *
   * BEHAVIORAL MECHANISM:
   * Updates the searchQuery string state when the user types into the search bar input.
   *
   * PARAMETERS:
   * - e (React.ChangeEvent<HTMLInputElement>): The input change event.
   *
   * RETURNS:
   * - void
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  /**
   * handleLanguageFilterChange
   *
   * BEHAVIORAL MECHANISM:
   * Updates the selectedLanguageId state when the user selects a language from the filter dropdown.
   *
   * PARAMETERS:
   * - e (React.ChangeEvent<HTMLSelectElement>): The select dropdown change event.
   *
   * RETURNS:
   * - void
   */
  const handleLanguageFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageId(e.target.value);
  }, []);

  /**
   * handleSortChange
   *
   * BEHAVIORAL MECHANISM:
   * Updates the sortOption state when the user changes the sorting order dropdown.
   *
   * PARAMETERS:
   * - e (React.ChangeEvent<HTMLSelectElement>): The select dropdown change event.
   *
   * RETURNS:
   * - void
   */
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  }, []);

  /**
   * handlePlayCollection
   *
   * BEHAVIORAL MECHANISM:
   * Sets playingCollection state to the target collection object, mounting the WordFlashCards game view.
   *
   * PARAMETERS:
   * - collection (VocabularyCollectionUncheckedCreateInput): The collection to study.
   *
   * RETURNS:
   * - void
   */
  const handlePlayCollection = useCallback((collection: VocabularyCollectionUncheckedCreateInput) => {
    setPlayingCollection(collection);
  }, []);

  /**
   * handleEditCollection
   *
   * BEHAVIORAL MECHANISM:
   * Sets editingCollection state to the target collection object, opening the EditCollectionModal dialog.
   *
   * PARAMETERS:
   * - collection (VocabularyCollectionUncheckedCreateInput): The collection to edit.
   *
   * RETURNS:
   * - void
   */
  const handleEditCollection = useCallback((collection: VocabularyCollectionUncheckedCreateInput) => {
    setEditingCollection(collection);
  }, []);

  /**
   * handleManageWords
   *
   * BEHAVIORAL MECHANISM:
   * Sets managingWordsCollection state to the target collection object, opening the WordsManagementModal dialog.
   *
   * PARAMETERS:
   * - collection (VocabularyCollectionUncheckedCreateInput): The collection whose words are being managed.
   *
   * RETURNS:
   * - void
   */
  const handleManageWords = useCallback((collection: VocabularyCollectionUncheckedCreateInput) => {
    setManagingWordsCollection(collection);
  }, []);

  /**
   * handleBackToCollections
   *
   * BEHAVIORAL MECHANISM:
   * Resets playingCollection state to null, returning the view back to the collections grid.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleBackToCollections = useCallback(() => {
    setPlayingCollection(null);
  }, []);

  /**
   * handleWordsUpdated
   *
   * BEHAVIORAL MECHANISM:
   * Immutably updates the words array of the target collection in local state whenever words are added,
   * edited, or deleted inside WordsManagementModal.
   *
   * PARAMETERS:
   * - collectionId (string): Unique identifier of the collection.
   * - updatedWords (VocabularyWordUncheckedCreateInput[]): Array of updated vocabulary words.
   *
   * RETURNS:
   * - void
   */
  const handleWordsUpdated = useCallback(
    (collectionId: string, updatedWords: VocabularyWordUncheckedCreateInput[]) => {
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, words: updatedWords } : c))
      );
      setManagingWordsCollection((prev) =>
        prev && prev.id === collectionId ? { ...prev, words: updatedWords } : prev
      );
    },
    []
  );

  /**
   * handleSaveCreateCollection
   *
   * BEHAVIORAL MECHANISM:
   * Triggers global loader, calls createCollection service API, prepends the new collection record
   * to local state, closes the modal, and shows a success notification toast.
   *
   * PARAMETERS:
   * - formData (CreateCollectionFormInputs): Form values emitted by CreateCollectionModal.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveCreateCollection = useCallback(
    async (formData: CreateCollectionFormInputs) => {
      if (!currentUser?.id) {
        showNotification("You must be logged in to create a collection.", "error");
        return;
      }

      setIsOpenLoader(true);
      const payload = {
        ownerId: currentUser.id,
        name: formData.name,
        languageId: formData.languageId,
        description: formData.description,
      };

      const { data: created, error } = await createCollection(payload);
      setIsOpenLoader(false);

      if (error || !created) {
        showNotification(error || "Failed to create collection.", "error");
        return;
      }

      const langObj = allLanguages.find((l) => l.id === payload.languageId);
      const newCollection: VocabularyCollectionUncheckedCreateInput = {
        ...created,
        name: payload.name,
        description: payload.description,
        languageId: payload.languageId,
        language: langObj || created.language || { id: payload.languageId, name: "Language" },
        words: [],
      };

      setCollections((prev) => [newCollection, ...prev]);
      setIsCreateModalOpen(false);
      showNotification("Collection created successfully!", "success");
    },
    [currentUser, allLanguages, setIsOpenLoader, showNotification]
  );

  /**
   * handleSaveEditCollection
   *
   * BEHAVIORAL MECHANISM:
   * Triggers global loader, calls updateCollection service API, updates the collection record in local state,
   * closes the modal, and shows a success notification toast.
   *
   * PARAMETERS:
   * - payload (CollectionUpdatePayload): Payload containing updated collection fields.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveEditCollection = useCallback(
    async (payload: CollectionUpdatePayload) => {
      setIsOpenLoader(true);
      const { data: updated, error } = await updateCollection(payload);
      setIsOpenLoader(false);

      if (error || !updated) {
        showNotification(error || "Failed to update collection.", "error");
        return;
      }

      const langObj = allLanguages.find((l) => l.id === payload.languageId);

      setCollections((prev) =>
        prev.map((c) =>
          c.id === payload.id
            ? {
                ...c,
                ...updated,
                name: payload.name,
                description: payload.description,
                languageId: payload.languageId,
                language: langObj || updated.language || c.language,
              }
            : c
        )
      );

      setEditingCollection(null);
      showNotification("Collection updated successfully!", "success");
    },
    [allLanguages, setIsOpenLoader, showNotification]
  );

  const availableLangList = useMemo(
    () => (allLanguages.length > 0 ? allLanguages : filterLanguages.map((l) => ({ id: l.id, name: l.name } as any))),
    [allLanguages, filterLanguages]
  );

  // If a collection is actively being played, show the WordFlashCards view
  if (playingCollection) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="flashcards"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <WordFlashCards collection={playingCollection} onBack={handleBackToCollections} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="collection-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}
        >
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <CollectionHeader onAddClick={() => setIsCreateModalOpen(true)} />

            {/* Filter & Sort Bar */}
            <CollectionFilterBar
              searchQuery={searchQuery}
              selectedLanguageId={selectedLanguageId}
              sortOption={sortOption}
              availableLanguages={filterLanguages}
              onSearchChange={handleSearchChange}
              onLanguageFilterChange={handleLanguageFilterChange}
              onSortChange={handleSortChange}
            />

            {/* Collections Grid */}
            <CollectionGrid
              collections={processedCollections}
              onPlay={handlePlayCollection}
              onEdit={handleEditCollection}
              onManageWords={handleManageWords}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Create Collection Modal Dialog */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        allLanguages={availableLangList}
        isLoading={isOpenLoader}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveCreateCollection}
      />

      {/* Edit Collection Modal Dialog */}
      <EditCollectionModal
        isOpen={Boolean(editingCollection)}
        collection={editingCollection}
        allLanguages={availableLangList}
        isLoading={isOpenLoader}
        onClose={() => setEditingCollection(null)}
        onSubmit={handleSaveEditCollection}
      />

      {/* Words Management Modal Dialog */}
      <WordsManagementModal
        isOpen={Boolean(managingWordsCollection)}
        collection={managingWordsCollection}
        onClose={() => setManagingWordsCollection(null)}
        onWordsUpdated={handleWordsUpdated}
      />
    </>
  );
}
