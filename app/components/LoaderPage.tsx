/**
 * PURPOSE:
 * Fullscreen page loader component featuring a fixed backdrop overlay
 * and a custom animated loader card with premium aesthetics.
 *
 * CONTEXT/PARENT FILE:
 * Can be mounted on full page transitions, initial route loads, or async page states.
 * Located in app/components/LoaderPage.tsx.
 */

"use client";

import React from "react";
import { designTokens } from "../constants/design-tokens";

interface LoaderPageProps {
  message?: string;
}

export default function LoaderPage({ message = "Loading experience..." }: LoaderPageProps) {
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen flex justify-center items-center screen-bg backdrop-blur-md">
      {/* Custom Premium Loader Card */}
      <div className={`p-8 sm:p-10 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} shadow-2xl shadow-[#82301c]/15 flex flex-col items-center justify-center gap-6 max-w-xs sm:max-w-sm w-full mx-4 select-none animate-in zoom-in-95 duration-300 relative overflow-hidden`}>
        {/* Subtle Background Accent Aura */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#82301c]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#d97757]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Dual Ring Animated Spinner Container */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-[#82301c]/15 animate-ping opacity-40" />

          {/* Outer Rotating Gradient Ring */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#82301c] border-r-[#d97757] animate-spin" style={{ animationDuration: '1.2s' }} />

          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#82301c]/80 border-l-[#d97757]/80 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.9s' }} />

          {/* Center Brand Icon Badge */}
          <div className="w-8 h-8 rounded-full bg-[#82301c] text-white flex items-center justify-center shadow-md shadow-[#82301c]/30 z-10">
            <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-center justify-center text-center gap-1.5 z-10">
          <span className={`text-base font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            MeeFins
          </span>
          <span className={`text-xs font-medium ${designTokens.colors.text.muted} animate-pulse`}>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
