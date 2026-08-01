/**
 * PURPOSE:
 * Renders the circular avatar preview and the file-input upload trigger.
 * Shows a fallback initial character when no avatar image is available.
 * Wrapped in React.memo to avoid re-renders when parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 * Mounted inside the Profile Card section of the dashboard.
 */

"use client";

import React, { memo, ChangeEvent } from "react";
import { designTokens } from "@/app/constants/design-tokens";

interface AvatarUploaderProps {
  displayAvatar: string | null;
  initials: string;
  isLoading: boolean;
  onChange: (file: File) => void;
}

const AvatarUploader = memo(function AvatarUploader({
  displayAvatar,
  initials,
  isLoading,
  onChange,
}: AvatarUploaderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center lg:text-left shrink-0">
      <div className="relative w-36 h-36 rounded-full bg-[#f5e9e2] overflow-hidden flex items-center justify-center border-4 border-[#dfccc1] shadow-lg shadow-[#82301c]/10 shrink-0 group">
        {displayAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-extrabold text-[#82301c] uppercase tracking-wider">{initials}</span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <label
          className={`px-4 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} cursor-pointer hover:bg-[#ebdcd3] transition shadow-xs flex items-center gap-1.5`}
        >
          <svg className="w-4 h-4 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Upload Avatar</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={isLoading}
          />
        </label>
        <span className={`text-[11px] ${designTokens.colors.text.muted}`}>
          JPG, PNG or GIF. Max 5MB.
        </span>
      </div>
    </div>
  );
});

export default AvatarUploader;
