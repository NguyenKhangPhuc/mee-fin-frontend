/**
 * PURPOSE:
 * Renders the filter control bar for the Meeting History page, allowing users to filter
 * meeting slots by status (ALL, OPEN, BOOKED, COMPLETED, CANCELLED) and date order (Newest/Oldest first).
 * Wrapped in React.memo for high performance.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - statusFilter (SlotStatus | "ALL", Required): Selected slot status filter value.
 * - orderFilter ("asc" | "desc", Required): Selected date order sorting option.
 * - onStatusChange (function, Required): Callback invoked when status filter changes.
 * - onOrderChange (function, Required): Callback invoked when date order filter changes.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { SlotStatus } from "@/app/types/enum";
import { designTokens } from "@/app/constants/design-tokens";

interface HistoryFilterBarProps {
  statusFilter: SlotStatus | "ALL";
  orderFilter: "asc" | "desc";
  onStatusChange: (status: SlotStatus | "ALL") => void;
  onOrderChange: (order: "asc" | "desc") => void;
}

/**
 * HistoryFilterBar
 *
 * BEHAVIORAL MECHANISM:
 * Displays select dropdowns for slot status filtering and date order sorting.
 * Animates into view with a subtle slide-down motion.
 *
 * PARAMETERS:
 * - props (HistoryFilterBarProps): Filter states and change handlers.
 *
 * RETURNS:
 * - JSX.Element: The filter controls container element.
 */
const HistoryFilterBar = memo(function HistoryFilterBar({
  statusFilter,
  orderFilter,
  onStatusChange,
  onOrderChange,
}: HistoryFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      className={`p-4 sm:p-5 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Filters
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-neutral-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as SlotStatus | "ALL")}
            className={`w-full sm:w-44 h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="BOOKED">Booked</option>
            <option value="OPEN">Open</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Date Order Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-neutral-500 shrink-0">Order:</span>
          <select
            value={orderFilter}
            onChange={(e) => onOrderChange(e.target.value as "asc" | "desc")}
            className={`w-full sm:w-44 h-10 px-3 border border-neutral-200 ${designTokens.radii.input} text-xs sm:text-sm bg-white outline-none ${designTokens.colors.border.focus}`}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
});

export default HistoryFilterBar;
