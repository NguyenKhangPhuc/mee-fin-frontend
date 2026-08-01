/**
 * PURPOSE:
 * Orchestrator client component for the LiveKit meeting room.
 * Manages video conference connection, real-time countdown timer, phase focus notifications,
 * force meeting end, and vocabulary collections management (compact list, create, edit, words management).
 *
 * CONTEXT/PARENT FILE:
 * Rendered by app/room/[slotId]/page.tsx Server Component.
 *
 * INPUTS / PARAMETERS:
 * - token (GenerateTokenResponse, Required): LiveKit room JWT connection payload.
 * - serverUrl (string, Required): LiveKit server URL.
 * - slotId (string, Required): Unique slot identifier.
 * - slotTitle (string, Optional): Meeting slot title.
 * - endsAt (number, Required): Timestamp in ms when the slot expires.
 * - durationMinutes (number, Required): Total slot duration in minutes.
 * - provideLanguageName (string, Required): Host/Provide language name.
 * - exchangeLanguageName (string, Required): Target/Exchange language name.
 * - initialCollections (VocabularyCollectionUncheckedCreateInput[], Optional): Initial collections data.
 * - allLanguages (LanguageUncheckedCreateInput[], Optional): Platform languages array.
 * - currentUser (SafeUser | null, Optional): Authenticated user session.
 */

"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useCountdown } from "@/app/hooks/useCountdown";
import { forceEndMeeting } from "@/app/services/slots/end-meeting-slot";
import { getCurrentDBTime } from "@/app/services/slots/get-current-db-time";
import { createCollection } from "@/app/services/collections/create-collection";
import { updateCollection, CollectionUpdatePayload } from "@/app/services/collections/update-collection";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { GenerateTokenResponse } from "@/app/services/livekit/generate-token";
import { DynamicModal } from "@/app/components/DynamicModal";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { LanguageUncheckedCreateInput } from "@/app/types/language";
import { SafeUser } from "@/app/types/authentication";

import RoomCollectionListModal from "./components/RoomCollectionListModal";
import CreateCollectionModal, { CreateCollectionFormInputs } from "@/app/collection/components/CreateCollectionModal";
import EditCollectionModal from "@/app/collection/components/EditCollectionModal";
import WordsManagementModal from "@/app/collection/components/WordsManagementModal";
import CustomLiveKitUI from "./components/CustomLiveKitUI";

interface RoomClientProps {
  token: GenerateTokenResponse;
  serverUrl: string;
  slotId: string;
  slotTitle?: string;
  endsAt: number;
  durationMinutes: number;
  provideLanguageName: string;
  exchangeLanguageName: string;
  initialCollections?: VocabularyCollectionUncheckedCreateInput[];
  allLanguages?: LanguageUncheckedCreateInput[];
  currentUser?: SafeUser | null;
}

/**
 * RoomClient
 *
 * BEHAVIORAL MECHANISM:
 * Manages video call connection via LiveKitRoom and renders custom control panels, timers,
 * half-time language switch notifications, and collection management dialogs.
 */
export default function RoomClient({
  token,
  serverUrl,
  slotId,
  slotTitle,
  endsAt,
  durationMinutes,
  provideLanguageName,
  exchangeLanguageName,
  initialCollections = [],
  allLanguages = [],
  currentUser,
}: RoomClientProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { setIsOpenLoader, isOpenLoader } = useLoader();

  // Room state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isHalfTimeModalOpen, setIsHalfTimeModalOpen] = useState<boolean>(false);
  const [clockOffset, setClockOffset] = useState<number>(0);

  // Vocabulary Collections state
  const [collections, setCollections] = useState<VocabularyCollectionUncheckedCreateInput[]>(initialCollections);
  const [isCollectionListOpen, setIsCollectionListOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingCollection, setEditingCollection] = useState<VocabularyCollectionUncheckedCreateInput | null>(null);
  const [managingWordsCollection, setManagingWordsCollection] = useState<VocabularyCollectionUncheckedCreateInput | null>(null);

  // Sync clock offset on mount
  useEffect(() => {
    async function syncClock() {
      const requestStart = Date.now();
      const { data, error } = await getCurrentDBTime();
      const requestEnd = Date.now();

      if (error || !data) {
        showNotification(error ?? "Failed to get current offset", "error");
        return;
      }
      const rtt = requestEnd - requestStart;
      const offset = data.serverNow + rtt / 2 - requestEnd;
      setClockOffset(offset);
    }

    syncClock();
  }, [showNotification]);

  const handleExpire = useCallback(() => {
    // Empty callback as backend BullMQ handles closing slot
  }, []);

  const { minutes, seconds, remaining } = useCountdown({
    endsAt,
    clockOffset,
    onExpire: handleExpire,
  });

  const totalDurationMs = durationMinutes * 60 * 1000;
  const elapsedMs = Math.max(0, totalDurationMs - remaining);
  const halfDurationMs = totalDurationMs / 2;
  const isFirstHalf = elapsedMs < halfDurationMs;

  const prevIsFirstHalfRef = useRef<boolean>(true);

  // Auto-pop half-time modal when transitioning into half-time
  useEffect(() => {
    if (prevIsFirstHalfRef.current && !isFirstHalf) {
      setIsHalfTimeModalOpen(true);
      showNotification(`Half-time reached! Switch focus to target language: ${exchangeLanguageName}`, "info");
    }
    prevIsFirstHalfRef.current = isFirstHalf;
  }, [isFirstHalf, exchangeLanguageName, showNotification]);

  const currentLanguage = isFirstHalf ? provideLanguageName : exchangeLanguageName;
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

  const handleCancelCall = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelModalOpen(false);
    setIsOpenLoader(true);
    const { error } = await forceEndMeeting({ slotId });
    setIsOpenLoader(false);

    if (error) {
      showNotification(error || "Failed to end meeting slot.", "error");
    } else {
      showNotification("Meeting ended successfully.", "success");
    }
    router.push("/dashboard");
  };

  const handleLeaveRoom = () => {
    showNotification("Left the meeting room.", "info");
    router.push("/dashboard");
  };

  // Vocabulary Collection Handlers
  const handleWordsUpdated = useCallback(
    (collectionId: string, updatedWords: VocabularyWordUncheckedCreateInput[]) => {
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, words: updatedWords } : c))
      );
      setManagingWordsCollection((prev) =>
        prev && prev.id === collectionId ? { ...prev, words: updatedWords } : prev
      );
    },
    []
  );

  const handleSaveCreateCollection = useCallback(
    async (formData: CreateCollectionFormInputs) => {
      if (!currentUser?.id) {
        showNotification("You must be logged in to create a collection.", "error");
        return;
      }

      setIsOpenLoader(true);
      const payload = {
        ownerId: currentUser.id,
        name: formData.name,
        languageId: formData.languageId,
        description: formData.description,
      };

      const { data: created, error } = await createCollection(payload);
      setIsOpenLoader(false);

      if (error || !created) {
        showNotification(error || "Failed to create collection.", "error");
        return;
      }

      const langObj = allLanguages.find((l) => l.id === payload.languageId);
      const newCollection: VocabularyCollectionUncheckedCreateInput = {
        ...created,
        name: payload.name,
        description: payload.description,
        languageId: payload.languageId,
        language: langObj || created.language || { id: payload.languageId, name: "Language" },
        words: [],
      };

      setCollections((prev) => [newCollection, ...prev]);
      setIsCreateModalOpen(false);
      showNotification("Collection created successfully!", "success");
    },
    [currentUser, allLanguages, setIsOpenLoader, showNotification]
  );

  const handleSaveEditCollection = useCallback(
    async (payload: CollectionUpdatePayload) => {
      setIsOpenLoader(true);
      const { data: updated, error } = await updateCollection(payload);
      setIsOpenLoader(false);

      if (error || !updated) {
        showNotification(error || "Failed to update collection.", "error");
        return;
      }

      const langObj = allLanguages.find((l) => l.id === payload.languageId);

      setCollections((prev) =>
        prev.map((c) =>
          c.id === payload.id
            ? {
                ...c,
                ...updated,
                name: payload.name,
                description: payload.description,
                languageId: payload.languageId,
                language: langObj || updated.language || c.language,
              }
            : c
        )
      );

      setEditingCollection(null);
      showNotification("Collection updated successfully!", "success");
    },
    [allLanguages, setIsOpenLoader, showNotification]
  );

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#0a0a0c] font-sans">
      <LiveKitRoom
        token={token.token}
        serverUrl={serverUrl}
        connect={true}
        video={true}
        audio={true}
        onDisconnected={() => {
          showNotification("Disconnected from room.", "info");
          router.push("/dashboard");
        }}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <CustomLiveKitUI
          slotTitle={slotTitle}
          minutes={minutes}
          seconds={seconds}
          currentLanguage={currentLanguage}
          isFirstHalf={isFirstHalf}
          provideLanguageName={provideLanguageName}
          exchangeLanguageName={exchangeLanguageName}
          progressPercent={progressPercent}
          collectionsCount={collections.length}
          isOpenLoader={isOpenLoader}
          onOpenCollections={() => setIsCollectionListOpen(true)}
          onLeave={handleLeaveRoom}
          onCancelCall={handleCancelCall}
        />
      </LiveKitRoom>

      {/* Half-Time Language Switch Modal */}
      <DynamicModal
        isOpen={isHalfTimeModalOpen}
        onConfirm={() => setIsHalfTimeModalOpen(false)}
        onDismiss={() => setIsHalfTimeModalOpen(false)}
        title="🔄 Half-Time Reached! Switch Language Focus"
        subTitle={`Phase 1 (${provideLanguageName}) is complete! Please switch your conversation focus to ${exchangeLanguageName} for the remaining half.`}
        confirmLabel={`Switch to ${exchangeLanguageName}`}
        dismissLabel="Close"
      />

      {/* Cancel Meeting Confirmation Modal */}
      <DynamicModal
        isOpen={isCancelModalOpen}
        onConfirm={handleConfirmCancel}
        onDismiss={() => setIsCancelModalOpen(false)}
        title="End Meeting"
        subTitle="This will kick all users out of the meeting and end it immediately. Are you sure?"
        confirmLabel="Yes, End It"
        dismissLabel="No, Stay"
        isDangerous
      />

      {/* Room Collections List Modal */}
      <RoomCollectionListModal
        isOpen={isCollectionListOpen}
        collections={collections}
        onClose={() => setIsCollectionListOpen(false)}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onEditClick={(col) => setEditingCollection(col)}
        onManageWordsClick={(col) => setManagingWordsCollection(col)}
      />

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        allLanguages={allLanguages}
        isLoading={isOpenLoader}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveCreateCollection}
      />

      {/* Edit Collection Modal */}
      <EditCollectionModal
        isOpen={Boolean(editingCollection)}
        collection={editingCollection}
        allLanguages={allLanguages}
        isLoading={isOpenLoader}
        onClose={() => setEditingCollection(null)}
        onSubmit={handleSaveEditCollection}
      />

      {/* Words Management Modal */}
      <WordsManagementModal
        isOpen={Boolean(managingWordsCollection)}
        collection={managingWordsCollection}
        onClose={() => setManagingWordsCollection(null)}
        onWordsUpdated={handleWordsUpdated}
      />
    </div>
  );
}
