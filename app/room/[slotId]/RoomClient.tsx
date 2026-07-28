"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useCountdown } from "@/app/hooks/useCountdown";
import { forceEndMeeting } from "@/app/services/slots/end-meeting-slot";
import { useNotification } from "@/app/context/NotificationContext";
import { useLoader } from "@/app/context/LoaderContext";
import { GenerateTokenResponse } from "@/app/services/livekit/generate-token";
import { getCurrentDBTime } from "@/app/services/slots/get-current-db-time";

interface RoomClientProps {
    token: GenerateTokenResponse;
    serverUrl: string;
    slotId: string;
    slotTitle?: string;
    endsAt: number;
    durationMinutes: number;
    provideLanguageName: string;
    exchangeLanguageName: string;
}

export default function RoomClient({
    token,
    serverUrl,
    slotId,
    slotTitle,
    endsAt,
    durationMinutes,
    provideLanguageName,
    exchangeLanguageName,
}: RoomClientProps) {
    const router = useRouter();
    const { showNotification } = useNotification();
    const { setIsOpenLoader, isOpenLoader } = useLoader();
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
    const [clockOffset, setClockOffset] = useState(0)
    useEffect(() => {
        async function syncClock() {
            const requestStart = Date.now(); // Date.now() CỦA TRÌNH DUYỆT USER
            const { data, error } = await getCurrentDBTime(); // gọi thẳng 1 API endpoint riêng cho việc này
            const requestEnd = Date.now(); // vẫn là Date.now() CỦA TRÌNH DUYỆT USER
            if (error || !data) {
                showNotification(error ?? "Failed to get current offset")
                return
            }
            const rtt = requestEnd - requestStart;
            const offset = data?.serverNow + rtt / 2 - requestEnd;

            setClockOffset(offset);
        }

        syncClock();
    }, []);

    const handleExpire = useCallback(() => {
        // logic khi hết giờ, hoặc để trống nếu backend đã handle
    }, []);
    // Empty onExpire callback as backend BullMQ handles closing call/slot
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

    // Auto-reopen the language focus panel when transitioning into half-time (Phase 2)
    useEffect(() => {
        if (prevIsFirstHalfRef.current && !isFirstHalf) {
            setIsPanelOpen(true);
            showNotification(`Half-time reached! Switch focus to target language: ${exchangeLanguageName}`, "info");
        }
        prevIsFirstHalfRef.current = isFirstHalf;
    }, [isFirstHalf, exchangeLanguageName, showNotification]);

    const currentLanguage = isFirstHalf ? provideLanguageName : exchangeLanguageName;
    const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

    const handleCancelCall = async () => {
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

    return (
        <div className="h-screen w-full relative overflow-hidden bg-neutral-950 font-sans">
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
                <VideoConference />
            </LiveKitRoom>

            {/* Panel Toggle Button when Closed */}
            {!isPanelOpen && (
                <button
                    type="button"
                    onClick={() => setIsPanelOpen(true)}
                    className="absolute top-4 right-4 z-40 bg-neutral-900/90 backdrop-blur-md border border-neutral-700/70 text-white px-3.5 py-2.5 rounded-xl shadow-2xl hover:bg-neutral-800 transition cursor-pointer flex items-center gap-2.5 text-xs font-semibold select-none animate-in fade-in duration-200"
                    title="Open Language & Timer Panel"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono font-bold tracking-wider text-sm">
                        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </span>
                    <span className="text-neutral-600">|</span>
                    <span className={`font-semibold ${isFirstHalf ? "text-emerald-400" : "text-sky-400"}`}>
                        {currentLanguage}
                    </span>
                    <svg className="w-4 h-4 text-neutral-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

            {/* Right Side Control & Countdown Overlay Panel */}
            {isPanelOpen && (
                <div className="absolute top-4 right-4 z-40 w-72 sm:w-80 bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 text-white select-none animate-in fade-in zoom-in-95 duration-200">
                    {/* Header with Close/Minimize Button */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <div className="flex items-center gap-2 truncate max-w-[190px]">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate">
                                {slotTitle || "MEETING_ROOM"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                LIVE
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsPanelOpen(false)}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer text-xs font-bold"
                                title="Minimize Panel"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Countdown Timer Display */}
                    <div className="flex flex-col items-center justify-center bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 shadow-inner">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Time Remaining
                        </span>
                        <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-widest my-0.5">
                            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Language Focus Card */}
                    <div className="flex flex-col gap-2.5 bg-neutral-950/50 p-3.5 rounded-xl border border-neutral-800/80">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                Current Focus
                            </span>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isFirstHalf
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                    }`}
                            >
                                {isFirstHalf ? "Phase 1: Host" : "Phase 2: Target"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${isFirstHalf
                                    ? "bg-emerald-400 shadow-xs shadow-emerald-400/50"
                                    : "bg-sky-400 shadow-xs shadow-sky-400/50"
                                    } animate-pulse shrink-0`}
                            />
                            <span className="text-sm font-bold text-white truncate">
                                {currentLanguage}
                            </span>
                        </div>

                        {/* Phase Progress Bar */}
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                                className={`h-full transition-all duration-1000 ${isFirstHalf ? "bg-emerald-500" : "bg-sky-500"
                                    }`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Cancel Call (End Meeting) Button */}
                    <button
                        type="button"
                        onClick={handleCancelCall}
                        disabled={isOpenLoader}
                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/40 border border-rose-500/40 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.684A1 1 0 008.279 3H5z" />
                        </svg>
                        Cancel Call (End Meeting)
                    </button>
                </div>
            )}
        </div>
    );
}
