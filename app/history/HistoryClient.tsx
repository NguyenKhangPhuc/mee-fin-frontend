/**
 * PURPOSE:
 * Orchestrator client component for the Meeting History page.
 * Manages slot state, filtering by status/order, pagination, modal popups for creating/editing ratings,
 * and delete confirmation dialogs using DynamicModal.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/history/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - currentUser (SafeUser | null, Optional): Authenticated user session.
 * - initialSlots (SlotUncheckedCreateInput[], Optional): Initial page 1 slots data.
 * - initialMeta (PaginationMeta, Optional): Pagination metadata object.
 */

"use client";

import React, { useState, useCallback } from "react";
import { SafeUser } from "@/app/types/authentication";
import { SlotUncheckedCreateInput } from "@/app/types/slot";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { SlotStatus } from "@/app/types/enum";
import { getAllUserSlots } from "@/app/services/slots/get-user-slots";
import { createRating, updateRating, deleteRating } from "@/app/services/ratings";
import { PaginationMeta } from "@/app/services/profile/get-all-user";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { DynamicModal } from "@/app/components/DynamicModal";
import Pagination from "@/app/components/Pagination";

import HistoryFilterBar from "./components/HistoryFilterBar";
import HistorySlotCard from "./components/HistorySlotCard";
import RatingModal, { RatingFormInputs } from "./components/RatingModal";

interface HistoryClientProps {
  currentUser?: SafeUser | null;
  initialSlots?: SlotUncheckedCreateInput[];
  initialMeta?: PaginationMeta;
}

/**
 * HistoryClient
 *
 * BEHAVIORAL MECHANISM:
 * Serves as the primary orchestrator for meeting history slots.
 * Communicates with backend slot and rating APIs, manages local slot array state immutably upon ratings
 * creation, updation, and deletion.
 *
 * PARAMETERS:
 * - props (HistoryClientProps): Contains currentUser, initialSlots, and initialMeta.
 *
 * RETURNS:
 * - JSX.Element: The meeting history page layout.
 */
export default function HistoryClient({
  currentUser,
  initialSlots = [],
  initialMeta,
}: HistoryClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader, isOpenLoader } = useLoader();

  // Slots & Filter State
  const [slotsList, setSlotsList] = useState<SlotUncheckedCreateInput[]>(initialSlots);
  const [statusFilter, setStatusFilter] = useState<SlotStatus | "ALL">("ALL");
  const [orderFilter, setOrderFilter] = useState<"asc" | "desc">("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(initialMeta?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(initialMeta?.totalPages || 1);
  const [totalCount, setTotalCount] = useState<number>(initialMeta?.total || initialSlots.length);

  // Rating Modal State
  const [ratingSlot, setRatingSlot] = useState<SlotUncheckedCreateInput | null>(null);
  const [editingRating, setEditingRating] = useState<SlotRatingUncheckedCreateInput | null>(null);

  // Delete Confirmation Modal State
  const [deletingTarget, setDeletingTarget] = useState<{ slotId: string; ratingId: string } | null>(null);

  /**
   * fetchSlots
   *
   * BEHAVIORAL MECHANISM:
   * Internal helper to fetch slots with target page, status, and order parameters.
   */
  const fetchSlots = useCallback(
    async (page: number, status: SlotStatus | "ALL", order: "asc" | "desc") => {
      setIsOpenLoader(true);
      const queryStatus = status === "ALL" ? undefined : status;
      const { data: res, error } = await getAllUserSlots({
        page,
        limit: 10,
        status: queryStatus,
        order,
      });
      setIsOpenLoader(false);

      if (error || !res) {
        showNotification(error || "Failed to load history slots.", "error");
        return;
      }

      setSlotsList(res.data);
      setCurrentPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);
    },
    [setIsOpenLoader, showNotification]
  );

  /**
   * handleStatusFilterChange
   */
  const handleStatusFilterChange = useCallback(
    (newStatus: SlotStatus | "ALL") => {
      setStatusFilter(newStatus);
      fetchSlots(1, newStatus, orderFilter);
    },
    [orderFilter, fetchSlots]
  );

  /**
   * handleOrderFilterChange
   */
  const handleOrderFilterChange = useCallback(
    (newOrder: "asc" | "desc") => {
      setOrderFilter(newOrder);
      fetchSlots(1, statusFilter, newOrder);
    },
    [statusFilter, fetchSlots]
  );

  /**
   * handlePageChange
   */
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
      fetchSlots(newPage, statusFilter, orderFilter);
    },
    [currentPage, totalPages, statusFilter, orderFilter, fetchSlots]
  );

  /**
   * handleOpenCreateRating
   */
  const handleOpenCreateRating = useCallback((slot: SlotUncheckedCreateInput) => {
    setRatingSlot(slot);
    setEditingRating(null);
  }, []);

  /**
   * handleOpenEditRating
   */
  const handleOpenEditRating = useCallback(
    (slot: SlotUncheckedCreateInput, rating: SlotRatingUncheckedCreateInput) => {
      setRatingSlot(slot);
      setEditingRating(rating);
    },
    []
  );

  /**
   * handleSaveRating
   *
   * BEHAVIORAL MECHANISM:
   * Handles both creation of new rating and updation of existing rating.
   * Calculates raterId (current user) and ratedUserId (other participant).
   */
  const handleSaveRating = useCallback(
    async (formData: RatingFormInputs) => {
      if (!ratingSlot || !ratingSlot.id || !currentUser?.id) {
        showNotification("Missing session or slot information.", "error");
        return;
      }

      const isHost = ratingSlot.ownerId === currentUser.id;
      const ratedUserId = isHost ? ratingSlot.exchangeUserId : ratingSlot.ownerId;

      if (!ratedUserId) {
        showNotification("Cannot determine target user to rate.", "error");
        return;
      }

      setIsOpenLoader(true);

      if (editingRating?.id) {
        // Edit Mode
        const { data: updated, error } = await updateRating({
          id: editingRating.id,
          slotId: ratingSlot.id,
          raterId: currentUser.id,
          ratedUserId,
          rating: formData.rating,
          feedback: formData.feedback,
        });

        setIsOpenLoader(false);

        if (error || !updated) {
          showNotification(error || "Failed to update rating.", "error");
          return;
        }

        // Update local state
        setSlotsList((prev) =>
          prev.map((s) => {
            if (s.id !== ratingSlot.id) return s;
            const updatedRatings = (s.slotRatings || []).map((r) =>
              r.id === editingRating.id ? { ...r, ...updated, rating: formData.rating, feedback: formData.feedback } : r
            );
            return { ...s, slotRatings: updatedRatings };
          })
        );

        showNotification("Rating updated successfully!", "success");
      } else {
        // Create Mode
        const { data: created, error } = await createRating({
          slotId: ratingSlot.id,
          raterId: currentUser.id,
          ratedUserId,
          rating: formData.rating,
          feedback: formData.feedback,
        });

        setIsOpenLoader(false);

        if (error || !created) {
          showNotification(error || "Failed to submit rating.", "error");
          return;
        }

        const newRating: SlotRatingUncheckedCreateInput = {
          ...created,
          raterId: currentUser.id,
          ratedUserId,
          rating: formData.rating,
          feedback: formData.feedback,
        };

        // Update local state
        setSlotsList((prev) =>
          prev.map((s) => {
            if (s.id !== ratingSlot.id) return s;
            return {
              ...s,
              slotRatings: [...(s.slotRatings || []), newRating],
            };
          })
        );

        showNotification("Rating submitted successfully!", "success");
      }

      setRatingSlot(null);
      setEditingRating(null);
    },
    [ratingSlot, editingRating, currentUser, setIsOpenLoader, showNotification]
  );

  /**
   * handleOpenDeleteConfirm
   */
  const handleOpenDeleteConfirm = useCallback((slotId: string, ratingId: string) => {
    setDeletingTarget({ slotId, ratingId });
  }, []);

  /**
   * handleConfirmDeleteRating
   */
  const handleConfirmDeleteRating = useCallback(async () => {
    if (!deletingTarget) return;

    setIsOpenLoader(true);
    const { error } = await deleteRating({
      id: deletingTarget.ratingId,
      slotId: deletingTarget.slotId,
    });
    setIsOpenLoader(false);

    if (error) {
      showNotification(error || "Failed to delete rating.", "error");
      return;
    }

    // Remove rating from local state
    setSlotsList((prev) =>
      prev.map((s) => {
        if (s.id !== deletingTarget.slotId) return s;
        return {
          ...s,
          slotRatings: (s.slotRatings || []).filter((r) => r.id !== deletingTarget.ratingId),
        };
      })
    );

    setDeletingTarget(null);
    showNotification("Rating deleted successfully.", "success");
  }, [deletingTarget, setIsOpenLoader, showNotification]);

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
              Meeting History
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${designTokens.colors.text.secondary}`}>
              Review past language exchange slots, manage ratings, and feedback
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 self-start sm:self-auto">
            Total Slots: {totalCount}
          </span>
        </div>

        {/* Filter Bar */}
        <HistoryFilterBar
          statusFilter={statusFilter}
          orderFilter={orderFilter}
          onStatusChange={handleStatusFilterChange}
          onOrderChange={handleOrderFilterChange}
        />

        {/* Slots List */}
        {slotsList.length === 0 ? (
          <div className={`p-12 text-center ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default}`}>
            <svg className="w-12 h-12 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>No meeting slots found</p>
            <p className={`text-xs mt-1 ${designTokens.colors.text.secondary}`}>Try clearing or changing your status filter</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {slotsList.map((slot, idx) => (
              <HistorySlotCard
                key={slot.id || idx}
                slot={slot}
                index={idx}
                currentUserId={currentUser?.id || ""}
                onRate={handleOpenCreateRating}
                onEditRating={handleOpenEditRating}
                onDeleteRating={handleOpenDeleteConfirm}
              />
            ))}
          </div>
        )}

        {/* Bottom Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isOpenLoader}
        />
      </div>

      {/* Create / Edit Rating Modal */}
      <RatingModal
        isOpen={Boolean(ratingSlot)}
        slot={ratingSlot}
        initialRating={editingRating}
        currentUserId={currentUser?.id || ""}
        isLoading={isOpenLoader}
        onClose={() => {
          setRatingSlot(null);
          setEditingRating(null);
        }}
        onSubmit={handleSaveRating}
      />

      {/* Delete Rating Confirmation Modal */}
      <DynamicModal
        isOpen={Boolean(deletingTarget)}
        onConfirm={handleConfirmDeleteRating}
        onDismiss={() => setDeletingTarget(null)}
        title="Delete Rating"
        subTitle="Are you sure you want to delete your feedback for this meeting slot? This action cannot be undone."
        confirmLabel="Yes, Delete"
        dismissLabel="Cancel"
        isDangerous
      />
    </div>
  );
}
