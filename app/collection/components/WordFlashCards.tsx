/**
 * PURPOSE:
 * Interactive Flashcard Game component for vocabulary collections.
 * Allows users to study collection words using 3D card flips, drag/swipe gestures
 * (swipe right = correct [Blue], swipe left = wrong [Red]), or side arrow buttons.
 * Card background smoothly tints Blue during right drag/click and Red during left drag/click.
 * Shows an animated results modal upon completing the deck with accuracy metrics.
 *
 * CONTEXT/PARENT FILE:
 * Rendered conditionally by app/collection/CollectionClient.tsx when a collection is being played.
 *
 * INPUTS / PARAMETERS:
 * - collection (VocabularyCollectionUncheckedCreateInput, Required): Collection object containing words array.
 * - onBack (function, Required): Callback to exit flashcards mode and return to collections list.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { designTokens } from "@/app/constants/design-tokens";

interface WordFlashCardsProps {
  collection: VocabularyCollectionUncheckedCreateInput;
  onBack: () => void;
}

/**
 * WordFlashCards
 *
 * BEHAVIORAL MECHANISM:
 * Manages flashcard game state (currentIndex, isFlipped, correctCount, wrongCount, isFinished).
 * Uses Framer Motion's useMotionValue and useTransform for live color tinting and drag-rotation feedback.
 * Swiping right or clicking the right arrow tints the card Blue and marks it as correct.
 * Swiping left or clicking the left arrow tints the card Red and marks it as incorrect.
 * Displays a popup modal at deck completion with play again and exit controls.
 */
export default function WordFlashCards({ collection, onBack }: WordFlashCardsProps) {
  const words: VocabularyWordUncheckedCreateInput[] = useMemo(
    () => collection.words || [],
    [collection.words]
  );

  const totalWords = words.length;

  // Game state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Motion values for live drag feedback & smooth color interpolation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const cardOpacity = useTransform(x, [-250, 0, 250], [0.6, 1, 0.6]);

  // Live background & border color interpolation during drag (-150px Red <-> 0 White <-> +150px Blue)
  const cardBgColor = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(244, 63, 94, 0.12)", "rgba(255, 255, 255, 1)", "rgba(14, 165, 233, 0.12)"]
  );
  const cardBorderColor = useTransform(
    x,
    [-150, 0, 150],
    ["rgb(244, 63, 94)", "rgb(229, 229, 229)", "rgb(14, 165, 233)"]
  );

  const isFinished = currentIndex >= totalWords && totalWords > 0;
  const currentWord = words[currentIndex] || null;
  const progressPercent = totalWords > 0 ? Math.min((currentIndex / totalWords) * 100, 100) : 0;
  const accuracyPercent =
    currentIndex > 0 ? Math.round((correctCount / currentIndex) * 100) : 0;

  // Answer handler
  const handleAnswer = useCallback(
    (isCorrect: boolean, direction: "left" | "right") => {
      if (currentIndex >= totalWords) return;

      setSwipeDirection(direction);

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      } else {
        setWrongCount((prev) => prev + 1);
      }

      setTimeout(() => {
        setIsFlipped(false);
        setSwipeDirection(null);
        x.set(0);
        setCurrentIndex((prev) => prev + 1);
      }, 180);
    },
    [currentIndex, totalWords, x]
  );

  // Reset game
  const handlePlayAgain = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    setSwipeDirection(null);
    x.set(0);
  }, [x]);

  // Drag end handler
  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleAnswer(true, "right");
    } else if (info.offset.x < -threshold) {
      handleAnswer(false, "left");
    } else {
      x.set(0);
    }
  };

  // Render empty state if collection has no words
  if (totalWords === 0) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans flex flex-col items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 max-w-md w-full text-center ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col items-center gap-5`}
        >
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>No Words in Collection</h2>
            <p className={`text-xs mt-1 ${designTokens.colors.text.secondary}`}>
              This collection does not contain any vocabulary words yet. Add words to start studying!
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} shadow-sm hover:opacity-95 transition cursor-pointer`}
          >
            Back to Collections
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative flex flex-col justify-between select-none`}>
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">

        {/* Top Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className={`self-start flex items-center gap-2 px-3.5 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Collections
          </button>

          {/* Collection Title & Language */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              {collection.language?.name || "Vocabulary"}
            </span>
            <h1 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary} truncate max-w-xs sm:max-w-md`}>
              {collection.name}
            </h1>
          </div>

          {/* Counters: Correct (Blue) & Wrong (Red) */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {correctCount} Correct
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {wrongCount} Wrong
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
            <span>Progress ({Math.min(currentIndex + 1, totalWords)} of {totalWords})</span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sky-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Card Game Container */}
        {!isFinished && currentWord && (
          <div className="flex flex-col items-center justify-center my-6 gap-6">

            {/* Flashcard with Side Arrows */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-8">

              {/* Left Arrow Button (Wrong / Red) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => handleAnswer(false, "left")}
                title="Mark Wrong (Slide Left)"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-md flex items-center justify-center cursor-pointer shrink-0 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              {/* Center Draggable Flashcard */}
              <div className="relative w-full max-w-lg h-72 sm:h-80 perspective-1000">
                <motion.div
                  drag="x"
                  dragElastic={0.6}
                  dragSnapToOrigin={true}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  style={{
                    x,
                    rotate,
                    opacity: cardOpacity,
                    backgroundColor: swipeDirection === "right" ? "#f0f9ff" : swipeDirection === "left" ? "#fff1f2" : cardBgColor,
                    borderColor: swipeDirection === "right" ? "#38bdf8" : swipeDirection === "left" ? "#fb7185" : cardBorderColor,
                  }}
                  animate={{
                    x: swipeDirection === "right" ? 300 : swipeDirection === "left" ? -300 : 0,
                    opacity: swipeDirection ? 0 : 1,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className={`w-full h-full p-8 ${designTokens.radii.card} ${designTokens.shadows.card} border-2 flex flex-col justify-between items-center text-center cursor-grab active:cursor-grabbing relative overflow-hidden shadow-xl`}
                >
                  {/* Category / Card Side Tag */}
                  <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-3">
                    <span>Card #{currentIndex + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full ${isFlipped ? "bg-sky-100 text-sky-700" : "bg-neutral-100 text-neutral-600"}`}>
                      {isFlipped ? "Meaning (Back)" : "Term (Front)"}
                    </span>
                  </div>

                  {/* Card Content (Front vs Back) */}
                  <div className="my-auto flex flex-col items-center justify-center gap-3">
                    {!isFlipped ? (
                      <>
                        <h2 className={`text-2xl sm:text-3xl font-extrabold ${designTokens.colors.text.primary} tracking-tight`}>
                          {currentWord.term}
                        </h2>
                        {currentWord.example && (
                          <p className="text-xs text-neutral-500 italic max-w-xs sm:max-w-sm line-clamp-2 mt-1">
                            &quot;{currentWord.example}&quot;
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-700 tracking-tight">
                          {currentWord.meaning}
                        </h2>
                        {currentWord.note && (
                          <p className="text-xs text-neutral-500 max-w-xs sm:max-w-sm line-clamp-2 mt-1">
                            Note: {currentWord.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Flip Hint */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 pt-3 border-t border-neutral-100 w-full justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Click card to flip • Drag left/right to answer</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Arrow Button (Correct / Blue) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => handleAnswer(true, "right")}
                title="Mark Correct (Slide Right)"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 shadow-md flex items-center justify-center cursor-pointer shrink-0 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

            </div>

            {/* Gesture Quick Helper */}
            <div className="flex items-center gap-6 text-xs font-semibold text-neutral-500">
              <span className="flex items-center gap-1.5 text-rose-600">
                ← Slide Left = Wrong (Red Card)
              </span>
              <span className="flex items-center gap-1.5 text-sky-600">
                Slide Right = Correct (Blue Card) →
              </span>
            </div>

          </div>
        )}

      </div>

      {/* Popup Modal: Results Summary */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`w-full max-w-md ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-8 flex flex-col items-center text-center gap-6 select-none`}
            >
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className={`text-2xl font-bold ${designTokens.colors.text.primary}`}>
                  Deck Completed!
                </h2>
                <p className={`text-xs mt-1 ${designTokens.colors.text.secondary}`}>
                  You have reviewed all {totalWords} cards in {collection.name}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Correct</span>
                  <span className="text-xl font-extrabold text-sky-700 mt-0.5">{correctCount}</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Wrong</span>
                  <span className="text-xl font-extrabold text-rose-700 mt-0.5">{wrongCount}</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Accuracy</span>
                  <span className="text-xl font-extrabold text-blue-700 mt-0.5">{accuracyPercent}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className={`flex-1 h-11 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} hover:bg-neutral-100 transition cursor-pointer`}
                >
                  Exit
                </button>
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className={`flex-1 h-11 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
