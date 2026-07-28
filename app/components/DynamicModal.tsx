/**
 * PURPOSE:
 * A reusable, animated full-screen blocking modal with a blurred backdrop.
 * Prevents any interaction with the page behind it until the user picks an option.
 * Styled to match the app's design system (neutral palette, rounded-2xl, shadow-xl).
 *
 * CONTEXT/PARENT FILE:
 * Imported wherever a confirmation dialog is needed (e.g. RoomClient cancel flow).
 *
 * INPUTS / PARAMETERS:
 * - isOpen: boolean — controls visibility
 * - onConfirm: () => void — callback for the primary "Yes" action
 * - onDismiss: () => void — callback for the secondary "No" / dismiss action
 * - title: string — bold heading displayed in the modal
 * - subTitle: string — supporting description text
 * - confirmLabel?: string — label for the confirm button (default: "Yes")
 * - dismissLabel?: string — label for the dismiss button (default: "No")
 * - isDangerous?: boolean — when true, styles the confirm button in danger red
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";

interface DynamicModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
    title: string;
    subTitle: string;
    confirmLabel?: string;
    dismissLabel?: string;
    isDangerous?: boolean;
}

/**
 * DynamicModal
 * ----------------
 * Full-screen blocking modal with a blurred backdrop.
 * Uses framer-motion for smooth enter/exit animations.
 */
export function DynamicModal({
    isOpen,
    onConfirm,
    onDismiss,
    title,
    subTitle,
    confirmLabel = "Yes",
    dismissLabel = "No",
    isDangerous = false,
}: DynamicModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-neutral-950/50 backdrop-blur-sm"
                    onClick={onDismiss}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 24 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`relative w-full max-w-sm mx-4 ${designTokens.radii.card} ${designTokens.colors.bg.card} p-6 ${designTokens.shadows.card} border ${designTokens.colors.border.default}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close (X) button */}
                        <button
                            type="button"
                            onClick={onDismiss}
                            aria-label="Dismiss modal"
                            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Danger icon badge (shown when isDangerous) */}
                        {isDangerous && (
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <h2 className={`text-sm font-bold ${designTokens.colors.text.primary} text-center leading-snug pr-4`}>
                            {title}
                        </h2>

                        {/* Subtitle */}
                        <p className={`mt-2 text-xs ${designTokens.colors.text.secondary} text-center leading-relaxed`}>
                            {subTitle}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-6 flex gap-2.5">
                            {/* Dismiss / No */}
                            <button
                                type="button"
                                onClick={onDismiss}
                                className={`cursor-pointer flex-1 ${designTokens.radii.button} border ${designTokens.colors.border.default} bg-white py-2.5 text-xs font-semibold ${designTokens.colors.text.secondary} transition-colors hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98]`}
                            >
                                {dismissLabel}
                            </button>

                            {/* Confirm / Yes */}
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={[
                                    "cursor-pointer flex-1 py-2.5 text-xs font-semibold text-white transition-all active:scale-[0.98]",
                                    designTokens.radii.button,
                                    isDangerous
                                        ? "bg-red-600 hover:bg-red-700 shadow-sm shadow-red-200"
                                        : "bg-neutral-900 hover:bg-neutral-800 shadow-sm shadow-neutral-200",
                                ].join(" ")}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
