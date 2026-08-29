/**
 * PURPOSE:
 * Interactive Client Component for Users Management in Admin panel.
 * Displays a paginated list of registered users in a responsive table,
 * allows admins to update user roles (USER <-> ADMIN), and opens a modal to
 * view and manage (delete slot / delete feedback) a user's slots from this week onwards.
 */

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeUser } from "@/app/types/authentication";
import { UserRole, SlotStatus } from "@/app/types/enum";
import { SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import Pagination from "@/app/components/Pagination";
import { DynamicModal } from "@/app/components/DynamicModal";
import { getAllUsers } from "@/app/services/admin/get-all-users";
import { updateUserRole } from "@/app/services/admin/update-user-role";
import { getUserSlotsAdmin } from "@/app/services/admin/get-user-slots-admin";
import { deleteSlotAdmin } from "@/app/services/admin/delete-slot-admin";
import { deleteRatingAdmin } from "@/app/services/admin/delete-rating-admin";
import { getStatusBadgeStyle, parseUtcDate } from "@/app/dashboard/components/helpers";

interface UsersManagementClientProps {
  initialUsers: SafeUser[];
  initialMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function UsersManagementClient({
  initialUsers,
  initialMeta,
}: UsersManagementClientProps) {
  const { showNotification } = useNotification();

  // Users table state
  const [users, setUsers] = useState<SafeUser[]>(initialUsers);
  const [page, setPage] = useState<number>(initialMeta.page || 1);
  const [totalPages, setTotalPages] = useState<number>(initialMeta.totalPages || 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Updating role state tracking
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Slot detail modal state
  const [selectedUserForSlots, setSelectedUserForSlots] = useState<SafeUser | null>(null);
  const [userSlots, setUserSlots] = useState<SlotUncheckedCreateInput[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState<boolean>(false);
  const [slotsPage, setSlotsPage] = useState<number>(1);
  const slotsLimit = 4;

  // Fetch users by page
  const fetchUsers = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      const { data, error } = await getAllUsers({ page: targetPage, limit: 10 });
      setIsLoading(false);

      if (error || !data) {
        showNotification(error || "Failed to fetch users", "error");
        return;
      }

      setUsers(data.data || []);
      setPage(data.meta.page);
      setTotalPages(data.meta.totalPages);
    },
    [showNotification]
  );

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  // Handle role change
  const handleRoleChange = async (targetUser: SafeUser, newRole: UserRole) => {
    if (targetUser.role === newRole) return;
    setUpdatingUserId(targetUser.id);

    const { data: updatedUser, error } = await updateUserRole({
      userId: targetUser.id,
      role: newRole,
    });

    setUpdatingUserId(null);

    if (error || !updatedUser) {
      showNotification(error || "Failed to update user role", "error");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
    );
    showNotification(`Updated role for ${targetUser.email} to ${newRole}`, "success");
  };

  // Handle open slots modal
  const handleOpenUserSlots = async (user: SafeUser) => {
    setSelectedUserForSlots(user);
    setIsSlotsLoading(true);
    setSlotsPage(1);

    const { data, error } = await getUserSlotsAdmin(user.id);
    setIsSlotsLoading(false);

    if (error || !data) {
      showNotification(error || "Failed to fetch user slots", "error");
      setUserSlots([]);
      return;
    }

    setUserSlots(data);
  };

  // DynamicModal confirmation state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    type: "slot" | "rating";
    targetId: string;
    slotId?: string;
  } | null>(null);

  // Trigger delete slot modal confirmation
  const onRequestDeleteSlot = (slotId: string) => {
    setDeleteConfirmState({ type: "slot", targetId: slotId });
  };

  // Trigger delete rating modal confirmation
  const onRequestDeleteRating = (ratingId: string, slotId: string) => {
    setDeleteConfirmState({ type: "rating", targetId: ratingId, slotId });
  };

  // Execute confirm delete action
  const handleConfirmDelete = async () => {
    if (!deleteConfirmState) return;
    const { type, targetId, slotId } = deleteConfirmState;
    setDeleteConfirmState(null);

    setIsSlotsLoading(true);

    if (type === "slot") {
      const { error } = await deleteSlotAdmin(targetId);
      setIsSlotsLoading(false);

      if (error) {
        showNotification(error, "error");
        return;
      }

      setUserSlots((prev) => prev.filter((s) => s.id !== targetId));
      showNotification("Slot deleted successfully", "success");
    } else {
      const { error } = await deleteRatingAdmin(targetId);
      setIsSlotsLoading(false);

      if (error) {
        showNotification(error, "error");
        return;
      }

      setUserSlots((prev) =>
        prev.map((s) => {
          if (s.id === slotId && s.slotRatings) {
            return {
              ...s,
              slotRatings: s.slotRatings.filter((r: any) => r.id !== targetId),
            };
          }
          return s;
        })
      );
      showNotification("Rating feedback deleted successfully", "success");
    }
  };

  // Pagination slice for modal slots
  const totalSlotsPages = Math.ceil(userSlots.length / slotsLimit) || 1;
  const paginatedUserSlots = userSlots.slice(
    (slotsPage - 1) * slotsLimit,
    slotsPage * slotsLimit
  );

  return (
    <div className={`min-h-screen ${designTokens.colors.bg.page} p-4 sm:p-6 lg:p-8 select-none`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header Title Section */}
        <div className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#82301c]">
              ADMIN_PANEL
            </span>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${designTokens.colors.text.primary}`}>
              Users Management
            </h1>
            <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary}`}>
              View all registered platform members, update role privileges, and inspect or manage their slots.
            </p>
          </div>

          <div className="px-4 py-2 bg-[#f8ede6] border border-[#dfccc1] rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs font-bold text-[#82301c]">
              Total Users: {initialMeta.total}
            </span>
          </div>
        </div>

        {/* Users Table Card */}
        <div className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} flex flex-col gap-6`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#61514d]">
              <div className="w-8 h-8 border-3 border-[#dfccc1] border-t-[#82301c] rounded-full animate-spin" />
              <span className="text-xs font-semibold">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-[#9c8c87] text-sm">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#dfccc1] text-xs font-bold uppercase tracking-wider text-[#82301c] bg-[#f8ede6]/60">
                    <th className="py-3.5 px-4 rounded-l-xl">#</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Created At</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfccc1]/60 text-xs text-[#291e1b]">
                  {users.map((user, idx) => {
                    const stt = (page - 1) * 10 + idx + 1;
                    const isUpdatingThisUser = updatingUserId === user.id;

                    return (
                      <tr key={user.id} className="hover:bg-[#f8ede6]/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#61514d]">{stt}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#82301c]">{user.email}</td>
                        <td className="py-3.5 px-4 font-medium">
                          {user.profile?.fullName || user.displayName || <span className="text-[#9c8c87] font-normal">—</span>}
                        </td>
                        <td className="py-3.5 px-4 text-[#61514d]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            disabled={isUpdatingThisUser}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                            className={`h-8 px-2.5 rounded-lg text-xs font-bold border ${designTokens.colors.border.default} ${designTokens.colors.bg.input} outline-none cursor-pointer ${
                              user.role === UserRole.ADMIN
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "text-[#291e1b]"
                            }`}
                          >
                            <option value={UserRole.USER}>USER</option>
                            <option value={UserRole.ADMIN}>ADMIN</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenUserSlots(user)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#82301c] hover:bg-[#6c2716] rounded-xl shadow-xs transition cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View slots this week ahead
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-2 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Slots Modal */}
      <AnimatePresence>
        {selectedUserForSlots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#291e1b]/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto ${designTokens.colors.bg.card} ${designTokens.radii.card} ${designTokens.shadows.card} border ${designTokens.colors.border.default} p-6 sm:p-7 flex flex-col gap-6 select-none`}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#dfccc1] pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#82301c]">
                    USER_SLOTS_THIS_WEEK_AHEAD
                  </span>
                  <h3 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
                    Slots for {selectedUserForSlots.profile?.fullName || selectedUserForSlots.displayName || selectedUserForSlots.email}
                  </h3>
                  <p className="text-xs text-[#61514d]">
                    Email: <span className="font-semibold text-[#82301c]">{selectedUserForSlots.email}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserForSlots(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9c8c87] hover:text-[#82301c] hover:bg-[#ebdcd3] transition cursor-pointer shrink-0 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              {isSlotsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#61514d]">
                  <div className="w-8 h-8 border-3 border-[#dfccc1] border-t-[#82301c] rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Loading user slots...</span>
                </div>
              ) : userSlots.length === 0 ? (
                <div className="text-center py-12 text-[#9c8c87] text-xs bg-[#f8ede6] rounded-xl border border-[#dfccc1]">
                  No slots found from this week ahead for this user.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4">
                    {paginatedUserSlots.map((slot) => {
                      const status = (slot.status as SlotStatus) || SlotStatus.OPEN;

                      return (
                        <div
                          key={slot.id}
                          className="p-4 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col gap-3"
                        >
                          {/* Slot Header */}
                          <div className="flex items-start justify-between gap-3 border-b border-[#dfccc1]/60 pb-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${getStatusBadgeStyle(status)}`}>
                                  {status}
                                </span>
                                <span className="text-xs font-bold text-[#82301c]">
                                  {slot.title}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#61514d]">
                                Room ID: <code className="font-mono text-[#82301c]">{slot.id}</code>
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRequestDeleteSlot(slot.id!)}
                              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Slot
                            </button>
                          </div>

                          {/* Slot Information Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-semibold text-[#61514d]">Start Time: </span>
                              <span className="font-bold text-[#82301c]">
                                {parseUtcDate(slot.startTime).toLocaleString([], {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div>
                              <span className="font-semibold text-[#61514d]">End Time: </span>
                              <span className="font-bold text-[#82301c]">
                                {parseUtcDate(slot.endTime).toLocaleString([], {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div>
                              <span className="font-semibold text-[#61514d]">Provided Lang (Host): </span>
                              <span className="font-bold text-emerald-700">
                                {slot.provideLanguage?.name || "N/A"}
                              </span>
                            </div>

                            <div>
                              <span className="font-semibold text-[#61514d]">Exchange Lang (Wanted): </span>
                              <span className="font-bold text-sky-700">
                                {slot.exchangeLanguage?.name || "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Ratings & Feedbacks List */}
                          {slot.slotRatings && slot.slotRatings.length > 0 && (
                            <div className="mt-1 flex flex-col gap-2 pt-2 border-t border-[#dfccc1]/60">
                              <span className="text-xs font-bold text-[#82301c]">
                                Slot Feedbacks & Ratings ({slot.slotRatings.length}):
                              </span>
                              <div className="flex flex-col gap-2">
                                {slot.slotRatings.map((rating: any) => (
                                  <div
                                    key={rating.id}
                                    className="p-2.5 rounded-lg bg-[#fffdfb] border border-[#dfccc1] flex items-start justify-between gap-3 text-xs"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#82301c]">
                                          ⭐ {rating.score}/5
                                        </span>
                                        <span className="text-[11px] text-[#61514d]">
                                          by {rating.rater?.displayName || rating.rater?.email || "User"}
                                        </span>
                                      </div>
                                      <p className="text-xs text-[#291e1b] italic">
                                        &quot;{rating.comment || "No comment provided."}&quot;
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => onRequestDeleteRating(rating.id, slot.id!)}
                                      className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded border border-red-200 transition cursor-pointer shrink-0"
                                    >
                                      Delete Feedback
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Slots Pagination */}
                  {totalSlotsPages > 1 && (
                    <div className="pt-2 flex justify-center">
                      <Pagination
                        currentPage={slotsPage}
                        totalPages={totalSlotsPages}
                        onPageChange={(p) => setSlotsPage(p)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end pt-2 border-t border-[#dfccc1]">
                <button
                  type="button"
                  onClick={() => setSelectedUserForSlots(null)}
                  className={`px-5 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DynamicModal for Delete Confirmations */}
      <DynamicModal
        isOpen={deleteConfirmState !== null}
        onDismiss={() => setDeleteConfirmState(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteConfirmState?.type === "slot"
            ? "Delete Language Exchange Slot"
            : "Delete Rating & Feedback"
        }
        subTitle={
          deleteConfirmState?.type === "slot"
            ? "Are you sure you want to permanently delete this slot? This action cannot be undone."
            : "Are you sure you want to remove this feedback rating? This action cannot be undone."
        }
        confirmLabel="Delete"
        dismissLabel="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
