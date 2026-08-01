/**
 * PURPOSE:
 * Interactive Flashcard Game component for vocabulary collections.
 * Allows users to study collection words using 3D card flips, drag/swipe gestures,
 * or side arrow buttons.
 * Redesigned to match the #82301c theme token design system, and centered both
 * horizontally (X-axis) and vertically (Y-axis) on the screen.
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
 * Centered on screen both horizontally (X-axis) and vertically (Y-axis).
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

  // Live background & border color interpolation during drag
  const cardBgColor = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(244, 63, 94, 0.12)", "rgba(252, 247, 243, 1)", "rgba(130, 48, 28, 0.12)"]
  );
  const cardBorderColor = useTransform(
    x,
    [-150, 0, 150],
    ["rgb(244, 63, 94)", "rgb(223, 204, 193)", "rgb(130, 48, 28)"]
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
      <div className="min-h-screen w-full bg-[#f4ebe4] font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 max-w-md w-full text-center bg-[#fcf7f3] rounded-3xl border border-[#dfccc1] shadow-xl flex flex-col items-center gap-5 my-auto text-[#82301c]"
        >
          <div className="w-16 h-16 rounded-full bg-[#f5e9e2] border border-[#dfccc1] flex items-center justify-center text-[#82301c]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#82301c]">No Words in Collection</h2>
            <p className="text-xs mt-1 text-[#5c4a44] font-medium">
              This collection does not contain any vocabulary words yet. Add words to start studying!
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#82301c] hover:bg-[#6c2716] rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer"
          >
            Back to Collections
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4ebe4] font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 select-none">
      <div className="max-w-4xl w-full flex flex-col gap-6 my-auto">

        {/* Top Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfccc1] pb-5"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="self-start flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#82301c] bg-[#ede0d7] border border-[#dfccc1] rounded-xl hover:bg-[#dfccc1]/50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Collections</span>
          </button>

          {/* Collection Title & Language */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
              {collection.language?.name || "Vocabulary"}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#82301c] truncate max-w-xs sm:max-w-md">
              {collection.name}
            </h1>
          </div>

          {/* Counters: Correct & Wrong */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#82301c]/10 text-[#82301c] border border-[#82301c]/30">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {correctCount} Correct
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {wrongCount} Wrong
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-[#82301c]">
            <span>Progress ({Math.min(currentIndex + 1, totalWords)} of {totalWords})</span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-[#ede0d7] rounded-full overflow-hidden border border-[#dfccc1]">
            <motion.div
              className="h-full bg-[#82301c] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Card Game Container (Centered X & Y) */}
        {!isFinished && currentWord && (
          <div className="flex flex-col items-center justify-center my-4 gap-6">

            {/* Flashcard with Side Arrows */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-8">

              {/* Left Arrow Button (Wrong / Red) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => handleAnswer(false, "left")}
                title="Mark Wrong (Slide Left)"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#fcf7f3] border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 shadow-md flex items-center justify-center cursor-pointer shrink-0 transition"
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
                    backgroundColor: swipeDirection === "right" ? "#f5e9e2" : swipeDirection === "left" ? "#fff1f2" : cardBgColor,
                    borderColor: swipeDirection === "right" ? "#82301c" : swipeDirection === "left" ? "#fb7185" : cardBorderColor,
                  }}
                  animate={{
                    x: swipeDirection === "right" ? 300 : swipeDirection === "left" ? -300 : 0,
                    opacity: swipeDirection ? 0 : 1,
                  }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className="w-full h-full p-8 rounded-3xl border-2 flex flex-col justify-between items-center text-center cursor-grab active:cursor-grabbing relative overflow-hidden shadow-xl bg-[#fcf7f3]"
                >
                  {/* Category / Card Side Tag */}
                  <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#82301c]/70 border-b border-[#dfccc1]/60 pb-3">
                    <span>Card #{currentIndex + 1}</span>
                    <span className={`px-2.5 py-0.5 rounded-full ${isFlipped ? "bg-[#82301c]/20 text-[#82301c]" : "bg-[#ede0d7] text-[#82301c]"}`}>
                      {isFlipped ? "Meaning (Back)" : "Term (Front)"}
                    </span>
                  </div>

                  {/* Card Content (Front vs Back) */}
                  <div className="my-auto flex flex-col items-center justify-center gap-3">
                    {!isFlipped ? (
                      <>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#82301c] tracking-tight">
                          {currentWord.term}
                        </h2>
                        {currentWord.example && (
                          <p className="text-xs text-[#5c4a44] italic max-w-xs sm:max-w-sm line-clamp-2 mt-1 font-medium">
                            &quot;{currentWord.example}&quot;
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#82301c] tracking-tight">
                          {currentWord.meaning}
                        </h2>
                        {currentWord.note && (
                          <p className="text-xs text-[#5c4a44] max-w-xs sm:max-w-sm line-clamp-2 mt-1 font-medium">
                            Note: {currentWord.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Flip Hint */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#82301c]/60 font-semibold">
                    <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span>Click card to flip</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Arrow Button (Correct / Theme Primary) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => handleAnswer(true, "right")}
                title="Mark Correct (Slide Right)"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#82301c] border-2 border-[#82301c] text-white hover:bg-[#6c2716] shadow-md flex items-center justify-center cursor-pointer shrink-0 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Gesture Legend */}
            <p className="text-[11px] font-semibold text-[#82301c]/70 flex items-center gap-2">
              <span>← Drag Left = Wrong</span>
              <span>•</span>
              <span>Drag Right = Correct →</span>
            </p>
          </div>
        )}

        {/* Results Modal upon completing deck */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-[#fcf7f3] rounded-3xl border border-[#dfccc1] shadow-2xl flex flex-col items-center gap-6 text-center max-w-lg mx-auto my-auto text-[#82301c]"
            >
              <div className="w-16 h-16 rounded-full bg-[#f5e9e2] border border-[#dfccc1] flex items-center justify-center text-3xl">
                🏆
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#82301c]">Deck Completed!</h2>
                <p className="text-xs text-[#5c4a44] mt-1 font-medium">
                  Great job! You have reviewed all {totalWords} cards in this collection.
                </p>
              </div>

              {/* Accuracy Stats Pill */}
              <div className="w-full grid grid-cols-2 gap-3 p-4 bg-[#f5e9e2]/60 rounded-2xl border border-[#dfccc1]">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-[#82301c]">{accuracyPercent}%</span>
                  <span className="text-[11px] font-bold text-[#82301c]/80 uppercase tracking-wider">Accuracy</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-[#82301c]">{correctCount}/{totalWords}</span>
                  <span className="text-[11px] font-bold text-[#82301c]/80 uppercase tracking-wider">Mastered</span>
                </div>
              </div>

              {/* Completion Action Buttons */}
              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className="flex-1 py-2.5 text-xs font-bold text-[#82301c] bg-[#ede0d7] hover:bg-[#dfccc1]/50 border border-[#dfccc1] rounded-xl transition cursor-pointer"
                >
                  Study Again
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[#82301c] hover:bg-[#6c2716] rounded-xl shadow-md shadow-[#82301c]/20 transition cursor-pointer"
                >
                  Back to List
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
