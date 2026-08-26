/**
 * PURPOSE:
 * Custom LiveKit video room user interface component.
 * Replicates the provided design mockup:
 * - Floating top header bar (Remaining time + Current language use).
 * - Side-by-side rounded video cards with participant name tags and mic status badges.
 * - Floating bottom pill control bar matching mockup buttons (Mic, Camera, Share, Vocab, Chat, Leave, End Session).
 * - Integrated LiveKit audio renderer and toggleable live chat overlay drawer.
 *
 * CONTEXT/PARENT FILE:
 * Rendered inside <LiveKitRoom> context in app/room/[slotId]/RoomClient.tsx.
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  useTracks,
  useLocalParticipant,
  VideoTrack,
  RoomAudioRenderer,
  isTrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import CustomChat from "./CustomChat";

interface CustomLiveKitUIProps {
  slotTitle?: string;
  minutes: number;
  seconds: number;
  currentLanguage: string;
  isFirstHalf: boolean;
  provideLanguageName: string;
  exchangeLanguageName: string;
  progressPercent: number;
  collectionsCount: number;
  isOpenLoader: boolean;
  onOpenCollections: () => void;
  onLeave: () => void;
  onCancelCall: () => void;
}

export default function CustomLiveKitUI({
  slotTitle,
  minutes,
  seconds,
  currentLanguage,
  isFirstHalf,
  provideLanguageName,
  exchangeLanguageName,
  progressPercent,
  collectionsCount,
  isOpenLoader,
  onOpenCollections,
  onLeave,
  onCancelCall,
}: CustomLiveKitUIProps) {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, cameraTrack } =
    useLocalParticipant();

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isTogglingMic, setIsTogglingMic] = useState<boolean>(false);
  const [isTogglingCam, setIsTogglingCam] = useState<boolean>(false);

  // Auto-enable Camera and Microphone on room entry if not active
  useEffect(() => {
    if (!localParticipant) return;

    if (!isCameraEnabled) {
      localParticipant.setCameraEnabled(true).catch((err) => {
        console.warn("[LiveKit UI] Auto-enable camera on room join failed:", err);
      });
    }

    if (!isMicrophoneEnabled) {
      localParticipant.setMicrophoneEnabled(true).catch((err) => {
        console.warn("[LiveKit UI] Auto-enable microphone on room join failed:", err);
      });
    }
  }, [localParticipant]);

  // Log local participant track publication state at render time (Diagnostic Step 1 & Deliverable 2)
  useEffect(() => {
    if (!localParticipant) return;
    const localVideoPubs = Array.from(localParticipant.videoTrackPublications.values());
    console.log("[LiveKit UI] Local participant video track publications state:", {
      isCameraEnabled,
      videoTrackPublicationsCount: localVideoPubs.length,
      publications: localVideoPubs.map((pub) => ({
        trackSid: pub.trackSid,
        source: pub.source,
        isMuted: pub.isMuted,
        hasTrack: Boolean(pub.track),
        readyState: pub.track?.mediaStreamTrack?.readyState,
      })),
    });
  }, [localParticipant, isCameraEnabled, cameraTrack]);

  // Subscribe to all camera video tracks (with placeholder fallback when video is off)
  const trackReferences = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);

  const handleToggleMic = async () => {
    if (isTogglingMic) return;
    setIsTogglingMic(true);
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch (err) {
      console.error("Error toggling microphone:", err);
    } finally {
      setIsTogglingMic(false);
    }
  };

  const handleToggleCam = async () => {
    if (isTogglingCam) return;
    setIsTogglingCam(true);
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } catch (err) {
      console.error("Error toggling camera:", err);
    } finally {
      setIsTogglingCam(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* LiveKit Remote Audio Handler */}
      <RoomAudioRenderer />

      {/* Floating Top Header Status Bar (Absolute Centered in Container, z-[45] > NavbarMobile z-40) */}
      <div className="absolute top-4 inset-x-0 mx-auto w-fit max-w-[92vw] z-[45] flex items-center justify-center gap-3 sm:gap-4 bg-[#1a181b]/90 border border-[#dfccc1]/30 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold">
        {/* Remaining Time */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-sm font-bold text-[#f8ede6] tracking-wider">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-[#dfccc1]/70 text-[11px] font-medium hidden sm:inline">
            remaining
          </span>
        </div>

        <div className="h-4 w-px bg-neutral-700/80" />

        {/* Current Language Use */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[11px] hidden sm:inline">Current Language:</span>
          <span className="font-bold text-[#f5e9e2] bg-[#82301c]/40 border border-[#82301c]/60 px-2.5 py-0.5 rounded-md text-xs shadow-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#d97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
            </svg>
            {currentLanguage}
          </span>
        </div>
      </div>

      {/* Main Video Stream Container (Center Stage) */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center pt-20 pb-28">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center justify-center">
          {trackReferences.map((trackRef) => {
            const isLocal = trackRef.participant.isLocal;
            const displayName =
              trackRef.participant.name ||
              trackRef.participant.identity ||
              (isLocal ? "You" : "Participant");
            const isMicOn = trackRef.participant.isMicrophoneEnabled;
            
            const localCamPub = isLocal ? localParticipant.getTrackPublication(Track.Source.Camera) : null;
            const hasVideo = isLocal
              ? isCameraEnabled && Boolean(localCamPub?.track || cameraTrack?.track)
              : isTrackReference(trackRef) &&
                Boolean(trackRef.publication?.track) &&
                !trackRef.publication?.isMuted;

            return (
              <div
                key={trackRef.participant.sid || trackRef.publication?.trackSid || displayName}
                className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141215] border border-[#dfccc1]/20 shadow-2xl flex items-center justify-center group"
              >
                {/* Video Track or Initial Avatar Placeholder */}
                {hasVideo ? (
                  <VideoTrack
                    trackRef={trackRef}
                    className="w-full h-full object-cover"
                    style={{ transform: isLocal ? "scaleX(-1)" : "none" }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a181b] text-[#dfccc1]">
                    <div className="w-20 h-20 rounded-full bg-[#82301c]/30 border border-[#82301c] flex items-center justify-center text-3xl font-extrabold text-[#f5e9e2] shadow-inner mb-2">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-neutral-400">
                      Video Disabled
                    </span>
                  </div>
                )}

                {/* Bottom-Left Participant Badge */}
                <div className="absolute bottom-3 left-3 bg-[#0d0c0e]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
                  {isMicOn ? (
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  )}
                  <span>{displayName} {isLocal ? "(You)" : ""}</span>
                </div>

                {/* Top-Right Status Indicator Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#82301c]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#82301c] text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span>{isLocal ? "HOST" : "PARTICIPANT"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Control Bar (Absolute Centered in Container, z-[45]) */}
      <footer className="absolute bottom-6 inset-x-0 mx-auto w-fit max-w-[95vw] z-[45] bg-[#1a181b]/95 border border-[#dfccc1]/30 backdrop-blur-xl rounded-full px-5 py-3 shadow-2xl flex items-center justify-center gap-2 sm:gap-4">
        {/* Microphone Toggle Button */}
        <button
          type="button"
          onClick={handleToggleMic}
          disabled={isTogglingMic}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition cursor-pointer shadow-md disabled:opacity-50 ${
            isMicrophoneEnabled
              ? "bg-[#82301c] text-white hover:bg-[#6c2716] shadow-[#82301c]/30"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
          title={isMicrophoneEnabled ? "Mute Mic" : "Unmute Mic"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMicrophoneEnabled
                  ? "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  : "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              }
            />
          </svg>
          <span className="text-[8px] font-semibold uppercase mt-0.5">
            {isMicrophoneEnabled ? "Mic" : "Muted"}
          </span>
        </button>

        {/* Camera Toggle Button */}
        <button
          type="button"
          onClick={handleToggleCam}
          disabled={isTogglingCam}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition cursor-pointer shadow-md disabled:opacity-50 ${
            isCameraEnabled
              ? "bg-[#82301c] text-white hover:bg-[#6c2716] shadow-[#82301c]/30"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
          title={isCameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[8px] font-semibold uppercase mt-0.5">
            {isCameraEnabled ? "Camera" : "Off"}
          </span>
        </button>

        <div className="h-6 w-px bg-neutral-700/80 mx-1 hidden sm:block" />

        {/* Share Screen Toggle */}
        <button
          type="button"
          onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer text-xs font-semibold ${
            isScreenShareEnabled ? "text-[#d97757] bg-[#82301c]/20" : "text-neutral-300"
          }`}
          title="Share Screen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[9px] mt-0.5">Share</span>
        </button>

        {/* Vocab Collections Button */}
        <button
          type="button"
          onClick={onOpenCollections}
          className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer text-neutral-300 text-xs font-semibold relative"
          title="Vocabulary Collections"
        >
          <svg className="w-4 h-4 text-[#d97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-[9px] mt-0.5">Vocab</span>
          {collectionsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#82301c] text-[#f5e9e2] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white/20">
              {collectionsCount}
            </span>
          )}
        </button>

        {/* Chat Toggle Button */}
        <button
          type="button"
          onClick={() => setIsChatOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl hover:bg-neutral-800 transition cursor-pointer text-xs font-semibold ${
            isChatOpen ? "text-[#f5e9e2] bg-[#82301c]/30" : "text-neutral-300"
          }`}
          title="Live Chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-[9px] mt-0.5">Chat</span>
        </button>

        <div className="h-6 w-px bg-neutral-700/80 mx-1 hidden sm:block" />

        {/* Leave Room Button */}
        <button
          type="button"
          onClick={onLeave}
          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-xs font-semibold transition cursor-pointer shrink-0"
        >
          Leave
        </button>

        {/* End Session Button */}
        <button
          type="button"
          onClick={onCancelCall}
          disabled={isOpenLoader}
          className="px-4 py-2 bg-[#82301c] hover:bg-[#6c2716] active:scale-[0.99] text-white text-xs font-bold rounded-full shadow-lg shadow-[#82301c]/30 border border-[#82301c] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.684A1 1 0 008.279 3H5z" />
          </svg>
          <span className="hidden sm:inline">End Session</span>
        </button>
      </footer>

      {/* Live Chat Overlay Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 right-4 bottom-24 z-[45] w-80 sm:w-96"
          >
            <CustomChat onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
