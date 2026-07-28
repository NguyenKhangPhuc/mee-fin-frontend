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
    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-100">
      <div className="relative w-24 h-24 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border-2 border-neutral-300 shrink-0">
        {displayAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-neutral-600 uppercase">{initials}</span>
        )}
      </div>

      <div className="flex flex-col items-center sm:items-start gap-2">
        <label
          className={`px-4 py-2 text-sm font-medium ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} border ${designTokens.colors.border.default} ${designTokens.radii.button} cursor-pointer hover:bg-neutral-100 transition shadow-xs`}
        >
          Upload New Avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={isLoading}
          />
        </label>
        <span className={`text-xs ${designTokens.colors.text.muted}`}>
          JPG, PNG or GIF. Max 5MB.
        </span>
      </div>
    </div>
  );
});

export default AvatarUploader;
