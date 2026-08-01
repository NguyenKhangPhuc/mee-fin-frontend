/**
 * PURPOSE:
 * Renders the left sidebar list of filtered community members with a custom-styled scrollbar,
 * rating_avg statistics, increased height, and an integrated reusable Pagination component at the bottom.
 * Wrapped in React.memo to prevent unnecessary re-renders when selecting profiles.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from CommunityClient.tsx.
 * Mounted in the left column (lg:col-span-4) of the Community page main layout.
 *
 * INPUTS / PARAMETERS:
 * - profiles (ProfileWithScore[], Required): Array of profile objects to display.
 * - selectedProfileId (string, Required): Currently selected profile ID.
 * - total (number, Required): Total profile count.
 * - currentPage (number, Required): Current active page.
 * - totalPages (number, Required): Total page count.
 * - isLoading (boolean, Optional): Loading state indicator.
 * - onSelectProfile (function, Required): Callback invoked when clicking a member.
 * - onPageChange (function, Required): Callback invoked when switching pages.
 */

"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileWithScore } from "@/app/types/profile";
import { designTokens } from "@/app/constants/design-tokens";
import Pagination from "@/app/components/Pagination";

interface MembersDirectoryProps {
  profiles: ProfileWithScore[];
  selectedProfileId: string;
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onSelectProfile: (id: string) => void;
  onPageChange: (page: number) => void;
}

/**
 * MembersDirectory
 *
 * BEHAVIORAL MECHANISM:
 * Displays total member count badge, renders a scrollable list of community member cards with custom scrollbar,
 * shows average rating (rating_avg), and mounts the reusable Pagination component below the list.
 *
 * PARAMETERS:
 * - props (MembersDirectoryProps): Profiles array, pagination state, and action callbacks.
 *
 * RETURNS:
 * - JSX.Element: The sidebar directory column element with list and pagination.
 */
const MembersDirectory = memo(function MembersDirectory({
  profiles,
  selectedProfileId,
  total,
  currentPage,
  totalPages,
  isLoading = false,
  onSelectProfile,
  onPageChange,
}: MembersDirectoryProps) {
  return (
    <div className="lg:col-span-4 flex flex-col justify-between gap-3">
      <div className="flex flex-col gap-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted} px-1`}>
          Members ({total > 0 ? total : profiles.length})
        </span>

        {/* Scrollable Members List Container */}
        <div className="flex flex-col gap-2.5 h-[580px] max-h-[calc(100vh-260px)] overflow-y-auto pr-1.5 custom-scrollbar">
          <AnimatePresence initial={false}>
            {profiles.map((p) => {
              const isSelected = selectedProfileId === p.id;
              const avatar = p.publicAvatarUrl || p.avatarUrl;
              const slotCount = p.provideSlots?.length || 0;
              const ratingAvg = Number(p.rating_avg ?? p.ratingAvg ?? 0).toFixed(1);
              const ratingCount = p.rating_count ?? p.ratingCount ?? 0;

              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectProfile(p.id)}
                  type="button"
                  className={`w-full text-left p-4 ${designTokens.radii.card} border transition-all flex items-center gap-3.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#f8ede6] border-[#82301c] shadow-sm ring-1 ring-[#82301c]/30"
                      : `${designTokens.colors.bg.card} ${designTokens.colors.border.default} hover:bg-[#f5e9e2]`
                  }`}
                >
                  {/* Member Avatar */}
                  <div className="relative w-11 h-11 rounded-full bg-[#f5e9e2] text-[#82301c] overflow-hidden flex items-center justify-center border border-[#dfccc1] shrink-0 font-bold">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={p.fullName || "User Avatar"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-extrabold text-[#82301c] uppercase">
                        {p.fullName?.charAt(0) || p.email?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-sm font-semibold truncate ${designTokens.colors.text.primary}`}>
                        {p.fullName || "Unnamed Member"}
                      </span>

                      {/* Rating Avg Badge */}
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#82301c] bg-[#f8ede6] border border-[#dfccc1] px-1.5 py-0.5 rounded shrink-0">
                        <span className="text-[#d97757]">★</span>
                        <span>{ratingAvg}</span>
                      </span>
                    </div>

                    <span className={`text-xs truncate ${designTokens.colors.text.muted}`}>
                      {p.university || p.email}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f5e9e2] text-[#82301c] border border-[#dfccc1]">
                        {slotCount} {slotCount === 1 ? "slot" : "slots"} open
                      </span>
                      {ratingCount > 0 && (
                        <span className={`text-[10px] ${designTokens.colors.text.muted} font-medium`}>
                          ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Reusable Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={isLoading}
      />
    </div>
  );
});

export default MembersDirectory;
