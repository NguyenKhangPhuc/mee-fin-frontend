/**
 * PURPOSE:
 * Orchestrator client component for the Community Members page.
 * Manages member search state, profile selection, slot booking requests, and
 * delegates UI rendering to modular sub-components in app/community/components/.
 * Employs React.memo, useMemo, and useCallback to ensure smooth performance
 * and zero FullCalendar re-render lag.
 *
 * CONTEXT/PARENT FILE:
 * Mounted by app/community/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - currentUser (SafeUser | null, Optional): Authenticated user session object.
 * - profiles (ProfileUncheckedCreateInput[], Required): Array of initial community member profile objects.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { SafeUser } from "@/app/types/authentication";
import { ProfileUncheckedCreateInput, SlotUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";
import { bookUserSlot } from "@/app/services/slots/book-user-slot";
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
  profiles: ProfileUncheckedCreateInput[];
}

/**
 * CommunityClient
 *
 * BEHAVIORAL MECHANISM:
 * Maintains the canonical community state (profilesList, searchQuery, selectedProfileId, selectedSlotToBook).
 * Uses useMemo for search filtering and FullCalendar event creation so that typing in the search bar
 * does not force FullCalendar to re-parse events or rebuild its DOM tree.
 * Uses useCallback for all event handlers passed to memoized child components.
 *
 * PARAMETERS:
 * - props (CommunityClientProps): Contains currentUser and initial profiles list.
 *
 * RETURNS:
 * - JSX.Element: The community members page layout with sidebar directory and detail panel.
 */
export default function CommunityClient({ currentUser, profiles }: CommunityClientProps) {
  const { showNotification } = useNotification();
  const { setIsOpenLoader } = useLoader();

  // State
  const [profilesList, setProfilesList] = useState<ProfileUncheckedCreateInput[]>(profiles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    profiles[0]?.id || ""
  );
  const [selectedSlotToBook, setSelectedSlotToBook] = useState<SlotUncheckedCreateInput | null>(null);

  // Derived values — memoized to prevent unnecessary re-computations
  const filteredProfiles = useMemo(() => {
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
   * handleSearchChange
   *
   * BEHAVIORAL MECHANISM:
   * Updates the searchQuery string state when the user types into the search input.
   * Triggers re-computation of the memoized filteredProfiles array.
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
   * Triggers re-computation of selectedProfile and its corresponding calendarEvents.
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
   * if the slot is already booked. If available, looks up the slot object inside the selected
   * member's provideSlots array and sets selectedSlotToBook to display the booking confirmation modal.
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
   * Upon API success, immutably updates profilesList in local state to mark the slot status as BOOKED
   * and link the exchangeUserId, then resets selectedSlotToBook to close the modal.
   *
   * PARAMETERS:
   * None (accesses state variables selectedSlotToBook, currentUser, selectedProfile via closure).
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
   * Resets selectedSlotToBook state to null, causing BookingModal's AnimatePresence
   * to animate the modal out of view.
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
              onSelectProfile={handleSelectProfile}
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
