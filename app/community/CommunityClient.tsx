/**
 * PURPOSE:
 * Orchestrator client component for the Community Members page.
 * Manages member search state, profile selection, pagination (currentPage, totalPages),
 * slot booking requests, and delegates UI rendering to modular sub-components in app/community/components/.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/community/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - currentUser (SafeUser | null, Optional): Authenticated user session object.
 * - initialProfiles (ProfileUncheckedCreateInput[], Optional): Initial page 1 profiles array.
 * - initialMeta (PaginationMeta, Optional): Pagination metadata object containing total, totalPages, page.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { SafeUser } from "@/app/types/authentication";
import { ProfileUncheckedCreateInput, SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { bookUserSlot } from "@/app/services/slots/book-user-slot";
import { getAllUserProfileWithLanguagesAndSlots, PaginationMeta } from "@/app/services/profile/get-all-user";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";

import { buildEventsForProfile } from "./components/helpers";
import CommunityHeader from "./components/CommunityHeader";
import MembersDirectory from "./components/MembersDirectory";
import MemberProfileCard from "./components/MemberProfileCard";
import MemberScheduleCalendar from "./components/MemberScheduleCalendar";
import BookingModal from "./components/BookingModal";

interface CommunityClientProps {
  currentUser?: SafeUser | null;
  initialProfiles?: ProfileUncheckedCreateInput[];
  initialMeta?: PaginationMeta;
}

/**
 * CommunityClient
 *
 * BEHAVIORAL MECHANISM:
 * Maintains the canonical community state (profilesList, searchQuery, currentPage, totalPages, selectedProfileId).
 * Handles async page changes via handlePageChange, requesting paginated profiles from getAllUserProfileWithLanguagesAndSlots.
 *
 * PARAMETERS:
 * - props (CommunityClientProps): Contains currentUser, initialProfiles, and initialMeta.
 *
 * RETURNS:
 * - JSX.Element: The community members page layout with sidebar directory and detail panel.
 */
export default function CommunityClient({
  currentUser,
  initialProfiles = [],
  initialMeta,
}: CommunityClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader, isOpenLoader } = useLoader();

  // State
  const [profilesList, setProfilesList] = useState<ProfileUncheckedCreateInput[]>(initialProfiles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    initialProfiles[0]?.id || ""
  );
  const [selectedSlotToBook, setSelectedSlotToBook] = useState<SlotUncheckedCreateInput | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(initialMeta?.page || 1);
  const [totalPages, setTotalPages] = useState<number>(initialMeta?.totalPages || 1);
  const [totalCount, setTotalCount] = useState<number>(initialMeta?.total || initialProfiles.length);

  // Derived values — memoized to prevent unnecessary re-computations
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profilesList;
    const q = searchQuery.toLowerCase();
    return profilesList.filter((p) => {
      const name = p.fullName?.toLowerCase() || "";
      const email = p.email?.toLowerCase() || "";
      const uni = p.university?.toLowerCase() || "";
      const prog = p.programme?.toLowerCase() || "";
      return name.includes(q) || email.includes(q) || uni.includes(q) || prog.includes(q);
    });
  }, [profilesList, searchQuery]);

  const selectedProfile = useMemo(() => {
    return profilesList.find((p) => p.id === selectedProfileId) || profilesList[0] || null;
  }, [profilesList, selectedProfileId]);

  const calendarEvents = useMemo(() => {
    return buildEventsForProfile(selectedProfile);
  }, [selectedProfile]);

  /**
   * handlePageChange
   *
   * BEHAVIORAL MECHANISM:
   * Triggers global loader, calls getAllUserProfileWithLanguagesAndSlots service for target page number,
   * updates profilesList, currentPage, totalPages, and selectedProfileId state on resolution.
   *
   * PARAMETERS:
   * - newPage (number): Target 1-indexed page number to fetch.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handlePageChange = useCallback(
    async (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

      setIsOpenLoader(true);
      const { data: res, error } = await getAllUserProfileWithLanguagesAndSlots({
        page: newPage,
        limit: 5,
      });
      setIsOpenLoader(false);

      if (error || !res) {
        showNotification(error || "Failed to load member page.", "error");
        return;
      }

      setProfilesList(res.data);
      setCurrentPage(res.meta.page);
      setTotalPages(res.meta.totalPages);
      setTotalCount(res.meta.total);

      if (res.data.length > 0) {
        setSelectedProfileId(res.data[0].id);
      }
    },
    [currentPage, totalPages, setIsOpenLoader, showNotification]
  );

  /**
   * handleSearchChange
   *
   * BEHAVIORAL MECHANISM:
   * Updates the searchQuery string state when the user types into the search input.
   *
   * PARAMETERS:
   * - query (string): The new search string entered by the user.
   *
   * RETURNS:
   * - void
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * handleSelectProfile
   *
   * BEHAVIORAL MECHANISM:
   * Updates the selectedProfileId state when a user clicks on a member card in the sidebar directory.
   *
   * PARAMETERS:
   * - id (string): The unique profile ID of the selected member.
   *
   * RETURNS:
   * - void
   */
  const handleSelectProfile = useCallback((id: string) => {
    setSelectedProfileId(id);
  }, []);

  /**
   * handleEventClick
   *
   * BEHAVIORAL MECHANISM:
   * Receives FullCalendar's event click payload. Inspects the event's extendedProps to verify
   * if the slot is already booked. If available, sets selectedSlotToBook to display the booking confirmation modal.
   *
   * PARAMETERS:
   * - clickInfo (any): The event click payload object emitted by FullCalendar.
   *
   * RETURNS:
   * - void
   */
  const handleEventClick = useCallback(
    (clickInfo: any) => {
      const isBooked = clickInfo.event.extendedProps?.isBooked;
      const slotId = clickInfo.event.id;

      if (isBooked) {
        showNotification("This slot has already been booked.", "info");
        return;
      }

      if (!selectedProfile || !selectedProfile.provideSlots) return;

      const slot = selectedProfile.provideSlots.find((s) => s.id === slotId);
      if (slot) {
        setSelectedSlotToBook(slot);
      }
    },
    [selectedProfile, showNotification]
  );

  /**
   * handleConfirmBook
   *
   * BEHAVIORAL MECHANISM:
   * Validates user authentication, triggers global loader state, and invokes the bookUserSlot service API.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleConfirmBook = useCallback(async () => {
    if (!selectedSlotToBook) return;
    if (!currentUser?.id) {
      showNotification("You must be logged in to book a slot.", "error");
      return;
    }

    setIsOpenLoader(true);
    const { error } = await bookUserSlot({
      slotId: selectedSlotToBook.id!,
      exchangeUserId: currentUser.id,
    });
    setIsOpenLoader(false);

    if (error) {
      showNotification(error || "Failed to book slot", "error");
      return;
    }

    // Update profilesList local state so the slot becomes booked
    setProfilesList((prevProfiles) =>
      prevProfiles.map((p) => {
        if (p.id !== selectedProfile?.id) return p;
        return {
          ...p,
          provideSlots: (p.provideSlots || []).map((s) => {
            if (s.id === selectedSlotToBook.id) {
              return {
                ...s,
                exchangeUserId: currentUser.id,
                status: "BOOKED" as any,
              };
            }
            return s;
          }),
        };
      })
    );

    setSelectedSlotToBook(null);
    showNotification("Slot booked successfully!", "success");
  }, [selectedSlotToBook, currentUser, selectedProfile, setIsOpenLoader, showNotification]);

  /**
   * handleCloseModal
   *
   * BEHAVIORAL MECHANISM:
   * Resets selectedSlotToBook state to null.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleCloseModal = useCallback(() => {
    setSelectedSlotToBook(null);
  }, []);

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-10 ${designTokens.colors.bg.page} font-sans relative`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <CommunityHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        {/* Main Content Layout */}
        {profilesList.length === 0 ? (
          <div
            className={`p-12 text-center ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default}`}
          >
            <p className={`text-sm ${designTokens.colors.text.secondary}`}>No community members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Members Directory Column (Left) */}
            <MembersDirectory
              profiles={filteredProfiles}
              selectedProfileId={selectedProfile?.id || ""}
              total={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isOpenLoader}
              onSelectProfile={handleSelectProfile}
              onPageChange={handlePageChange}
            />

            {/* Selected User Details & Schedule Calendar Column (Right) */}
            {selectedProfile && (
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Profile Card */}
                <MemberProfileCard profile={selectedProfile} />

                {/* Member Schedule Calendar */}
                <MemberScheduleCalendar
                  memberName={selectedProfile.fullName || "member"}
                  events={calendarEvents}
                  onEventClick={handleEventClick}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      <BookingModal
        slot={selectedSlotToBook}
        hostName={selectedProfile?.fullName || selectedProfile?.email || "Member"}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBook}
      />
    </div>
  );
}
