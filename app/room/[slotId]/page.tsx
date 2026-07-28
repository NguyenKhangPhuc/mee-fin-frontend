import Link from "next/link";
import { generateToken } from "@/app/services/livekit/generate-token";
import { getBookedSlot } from "@/app/services/slots/get-booked-slot";
import { designTokens } from "@/app/constants/design-tokens";
import RoomClient from "./RoomClient";

interface RoomPageProps {
    params: Promise<{
        slotId: string;
    }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
    const { slotId } = await params;

    const [{ data: token, error: tokenError }, { data: slot, error: slotError }] =
        await Promise.all([
            generateToken({ slotId }),
            getBookedSlot({ slotId }),
        ]);

    const error = tokenError || slotError;

    if (error || !token || !slot) {
        return (
            <div className={`min-h-screen ${designTokens.colors.bg.page} flex flex-col items-center justify-center p-6 text-center font-sans select-none`}>
                <div className={`max-w-md w-full p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200`}>
                    {/* Warning Icon Badge */}
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-600">
                            MEETING_ACCESS_ERROR
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold text-rose-600 tracking-tight leading-snug">
                            {error || "Unable to join the meeting room."}
                        </h1>
                        <p className={`text-xs ${designTokens.colors.text.secondary} mt-1 leading-relaxed`}>
                            Please check if your slot is active and within the allowed meeting window.
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className={`px-6 py-3 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} ${designTokens.shadows.button} hover:opacity-95 transition cursor-pointer flex items-center gap-2`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const provideLanguageName = (slot)?.provideLanguage?.name || "Provide Language";
    const exchangeLanguageName = (slot)?.exchangeLanguage?.name || "Exchange Language";

    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880";
    const endsAt = new Date(slot.endTime).getTime();
    const durationMinutes = slot.durationMinutes || 30;

    return (
        <RoomClient
            token={token}
            serverUrl={serverUrl}
            slotId={slotId}
            slotTitle={slot.title}
            endsAt={endsAt}
            durationMinutes={durationMinutes}
            provideLanguageName={provideLanguageName}
            exchangeLanguageName={exchangeLanguageName}
        />
    );
}
