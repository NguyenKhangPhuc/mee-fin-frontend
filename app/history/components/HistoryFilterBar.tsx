/**
 * PURPOSE:
 * Renders the filter controls for the Meeting History page, allowing users to filter by
 * slot status (ALL, COMPLETED, BOOKED, OPEN, CANCELLED) and sort order (Newest first, Oldest first).
 * Redesigned to match the #82301c theme token design system.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/history/HistoryClient.tsx.
 */

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { SlotStatus } from "@/app/types/enum";

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
 * Displays filter controls for meeting status and date sort order with theme #82301c colors.
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
      className="p-4 sm:p-5 bg-[#fcf7f3] rounded-2xl border border-[#dfccc1] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans select-none"
    >
      {/* Left: Status Filter Select */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs font-bold text-[#82301c] shrink-0">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as SlotStatus | "ALL")}
          className="w-full sm:w-48 h-10 px-3 border border-[#dfccc1] rounded-xl text-xs sm:text-sm bg-[#fffdfb] text-[#82301c] font-medium outline-none focus:border-[#82301c] cursor-pointer transition"
        >
          <option value="ALL">All Statuses</option>
          <option value={SlotStatus.COMPLETED}>Completed Only</option>
          <option value={SlotStatus.BOOKED}>Booked Only</option>
          <option value={SlotStatus.OPEN}>Open Only</option>
          <option value={SlotStatus.CANCELLED}>Cancelled Only</option>
        </select>
      </div>

      {/* Right: Date Sort Order Select */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-xs font-bold text-[#82301c] shrink-0">Sort Order:</span>
        <select
          value={orderFilter}
          onChange={(e) => onOrderChange(e.target.value as "asc" | "desc")}
          className="w-full sm:w-48 h-10 px-3 border border-[#dfccc1] rounded-xl text-xs sm:text-sm bg-[#fffdfb] text-[#82301c] font-medium outline-none focus:border-[#82301c] cursor-pointer transition"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </motion.div>
  );
});

export default HistoryFilterBar;
