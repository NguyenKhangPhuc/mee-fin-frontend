/**
 * PURPOSE:
 * Pop-up modal component for managing vocabulary words within a collection.
 * Displays all existing words, supports word deletion via deleteWord service,
 * and includes a react-hook-form to add new words or update selected words.
 * Redesigned to match the #82301c theme token design system.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/collection/CollectionClient.tsx.
 */

"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { createWord } from "@/app/services/words/create-word";
import { updateWord } from "@/app/services/words/update-word";
import { deleteWord } from "@/app/services/words/delete-word";
import { useNotification } from "@/app/context/NotificationContext";

interface WordsManagementModalProps {
  isOpen: boolean;
  collection: VocabularyCollectionUncheckedCreateInput | null;
  onClose: () => void;
  onWordsUpdated: (
    collectionId: string,
    updatedWords: VocabularyWordUncheckedCreateInput[]
  ) => void;
}

export type WordFormInputs = {
  term: string;
  meaning: string;
  example?: string;
  note?: string;
};

/**
 * WordsManagementModal
 *
 * BEHAVIORAL MECHANISM:
 * Displays a list of words in the active collection and an inline react-hook-form.
 * Clicking a word selects it for editing, turning the form into Update mode.
 * Deleting a word calls deleteWord API and removes it from the local list.
 */
const WordsManagementModal = memo(function WordsManagementModal({
  isOpen,
  collection,
  onClose,
  onWordsUpdated,
}: WordsManagementModalProps) {
  const { showNotification } = useNotification();

  // Words list and selection state
  const [wordsList, setWordsList] = useState<VocabularyWordUncheckedCreateInput[]>([]);
  const [selectedWord, setSelectedWord] = useState<VocabularyWordUncheckedCreateInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WordFormInputs>({
    defaultValues: {
      term: "",
      meaning: "",
      example: "",
      note: "",
    },
  });

  // Synchronize local words state when modal opens or collection changes
  useEffect(() => {
    if (collection) {
      setWordsList(collection.words || []);
      setSelectedWord(null);
      reset({ term: "", meaning: "", example: "", note: "" });
    }
  }, [collection, reset]);

  // Select a word for update mode
  const handleSelectWord = useCallback(
    (word: VocabularyWordUncheckedCreateInput) => {
      setSelectedWord(word);
      reset({
        term: word.term,
        meaning: word.meaning,
        example: word.example || "",
        note: word.note || "",
      });
    },
    [reset]
  );

  // Deselect word & return form to Add mode
  const handleCancelEdit = useCallback(() => {
    setSelectedWord(null);
    reset({ term: "", meaning: "", example: "", note: "" });
  }, [reset]);

  // Create word handler (type="submit")
  const handleCreateWord = async (data: WordFormInputs) => {
    if (!collection?.id) return;

    setIsSubmitting(true);
    const { data: created, error } = await createWord({
      collectionId: collection.id,
      term: data.term.trim(),
      meaning: data.meaning.trim(),
      example: data.example?.trim(),
      note: data.note?.trim(),
    });
    setIsSubmitting(false);

    if (error || !created) {
      showNotification(error || "Failed to create word", "error");
      return;
    }

    const nextList = [...wordsList, created];
    setWordsList(nextList);
    onWordsUpdated(collection.id, nextList);
    reset({ term: "", meaning: "", example: "", note: "" });
    showNotification("Word added successfully!", "success");
  };

  // Update word handler (type="button")
  const handleUpdateWord = async () => {
    if (!collection?.id || !selectedWord?.id) return;

    const data = {
      term: (document.getElementById("word-term-input") as HTMLInputElement)?.value || "",
      meaning: (document.getElementById("word-meaning-input") as HTMLInputElement)?.value || "",
      example: (document.getElementById("word-example-input") as HTMLInputElement)?.value || "",
      note: (document.getElementById("word-note-input") as HTMLInputElement)?.value || "",
    };

    if (!data.term.trim() || !data.meaning.trim()) {
      showNotification("Term and Meaning are required", "error");
      return;
    }

    setIsSubmitting(true);
    const { data: updated, error } = await updateWord({
      id: selectedWord.id,
      collectionId: collection.id,
      term: data.term.trim(),
      meaning: data.meaning.trim(),
      example: data.example?.trim(),
      note: data.note?.trim(),
    });
    setIsSubmitting(false);

    if (error || !updated) {
      showNotification(error || "Failed to update word", "error");
      return;
    }

    const nextList = wordsList.map((w) => (w.id === updated.id ? updated : w));
    setWordsList(nextList);
    onWordsUpdated(collection.id, nextList);
    setSelectedWord(null);
    reset({ term: "", meaning: "", example: "", note: "" });
    showNotification("Word updated successfully!", "success");
  };

  // Delete word handler
  const handleDeleteWord = async (
    e: React.MouseEvent,
    wordId: string
  ) => {
    e.stopPropagation();
    if (!collection?.id) return;

    setDeletingId(wordId);
    const { error } = await deleteWord({
      id: wordId,
      collectionId: collection.id,
    });
    setDeletingId(null);

    if (error) {
      showNotification(error, "error");
      return;
    }

    const nextList = wordsList.filter((w) => w.id !== wordId);
    setWordsList(nextList);
    onWordsUpdated(collection.id, nextList);

    if (selectedWord?.id === wordId) {
      setSelectedWord(null);
      reset({ term: "", meaning: "", example: "", note: "" });
    }

    showNotification("Word deleted successfully!", "success");
  };

  return (
    <AnimatePresence>
      {isOpen && collection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none font-sans"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-4xl max-h-[90vh] bg-[#fcf7f3] rounded-3xl border border-[#dfccc1] flex flex-col overflow-hidden shadow-2xl text-[#82301c]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#dfccc1] shrink-0 bg-[#f5e9e2]/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#82301c]/20 text-[#82301c] border border-[#82301c]/30">
                  {collection.language?.name || "Vocabulary"}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#82301c] truncate max-w-md">
                    {collection.name} — Words Management
                  </h3>
                  <p className="text-xs text-[#82301c]/80 font-medium">
                    Total Words: {wordsList.length}
                  </p>
                </div>
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

            {/* Modal Body: Grid Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-[#dfccc1]">
              
              {/* Left Column: Words List (7 cols) */}
              <div className="lg:col-span-7 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between shrink-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#82301c]">
                    Existing Words ({wordsList.length})
                  </h4>
                  <span className="text-[11px] text-[#82301c]/70 font-medium">
                    Click word to edit
                  </span>
                </div>

                {wordsList.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#dfccc1] rounded-2xl bg-[#fffdfb]">
                    <p className="text-xs text-[#82301c]/70 font-medium">
                      No words added to this collection yet. Use the form to add your first word!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {wordsList.map((word, idx) => {
                      const isSelected = selectedWord?.id === word.id;
                      const isDeleting = deletingId === word.id;

                      return (
                        <div
                          key={word.id || idx}
                          onClick={() => handleSelectWord(word)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "bg-[#f5e9e2] border-[#82301c] ring-2 ring-[#82301c]/20 shadow-xs"
                              : "bg-[#fffdfb] border-[#dfccc1] hover:border-[#82301c]/50 hover:bg-[#f5e9e2]/40"
                          }`}
                        >
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#82301c] truncate">
                                {word.term}
                              </span>
                              <span className="text-xs text-[#d97757] font-bold truncate">
                                = {word.meaning}
                              </span>
                            </div>

                            {word.example && (
                              <p className="text-[11px] text-[#5c4a44] italic truncate font-medium">
                                &quot;{word.example}&quot;
                              </p>
                            )}

                            {word.note && (
                              <p className="text-[10px] text-[#82301c]/70 truncate font-medium">
                                Note: {word.note}
                              </p>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={(e) => word.id && handleDeleteWord(e, word.id)}
                            title="Delete word"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: React Hook Form (5 cols) */}
              <div className="lg:col-span-5 p-5 flex flex-col gap-4 bg-[#f5e9e2]/30">
                <div className="flex items-center justify-between border-b border-[#dfccc1] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#82301c]">
                    {selectedWord ? "Edit Selected Word" : "Add New Word"}
                  </h4>
                  {selectedWord && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit(handleCreateWord)} className="flex flex-col gap-3.5">
                  {/* Term */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#82301c]">
                      Term (Vocabulary) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="word-term-input"
                      type="text"
                      placeholder="e.g. Bonjour"
                      className="h-9 px-3 border border-[#dfccc1] rounded-xl text-xs outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition font-medium"
                      {...register("term", { required: "Term is required" })}
                    />
                    {errors.term && (
                      <p className="text-[11px] font-semibold text-rose-600">
                        {errors.term.message}
                      </p>
                    )}
                  </div>

                  {/* Meaning */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#82301c]">
                      Meaning / Translation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="word-meaning-input"
                      type="text"
                      placeholder="e.g. Hello / Good day"
                      className="h-9 px-3 border border-[#dfccc1] rounded-xl text-xs outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition font-medium"
                      {...register("meaning", { required: "Meaning is required" })}
                    />
                    {errors.meaning && (
                      <p className="text-[11px] font-semibold text-rose-600">
                        {errors.meaning.message}
                      </p>
                    )}
                  </div>

                  {/* Example */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#82301c]">
                      Example Usage (Optional)
                    </label>
                    <input
                      id="word-example-input"
                      type="text"
                      placeholder="e.g. Bonjour tout le monde!"
                      className="h-9 px-3 border border-[#dfccc1] rounded-xl text-xs outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition font-medium"
                      {...register("example")}
                    />
                  </div>

                  {/* Note */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#82301c]">
                      Note / Context (Optional)
                    </label>
                    <input
                      id="word-note-input"
                      type="text"
                      placeholder="e.g. Formal greeting"
                      className="h-9 px-3 border border-[#dfccc1] rounded-xl text-xs outline-none focus:border-[#82301c] bg-[#fffdfb] text-[#82301c] transition font-medium"
                      {...register("note")}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#dfccc1]">
                    {selectedWord ? (
                      /* Update Mode: Button type="button" */
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleUpdateWord}
                        className="w-full py-2.5 text-xs font-bold bg-[#82301c] hover:bg-[#6c2716] text-white rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Update Word</span>
                      </button>
                    ) : (
                      /* Add Mode: Button type="submit" */
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 text-xs font-bold bg-[#82301c] hover:bg-[#6c2716] text-white rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Word</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default WordsManagementModal;
