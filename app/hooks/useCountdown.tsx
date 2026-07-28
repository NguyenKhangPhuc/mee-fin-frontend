// hooks/useCountdown.ts
'use client'
import { useEffect, useState, useRef } from 'react';

interface UseCountdownOptions {
    endsAt: number;       // epoch ms — thời điểm meeting kết thúc
    clockOffset: number;  // ms — độ lệch giữa client và server
    onExpire?: () => void;
}

export function useCountdown({ endsAt, clockOffset, onExpire }: UseCountdownOptions) {
    const [remaining, setRemaining] = useState(() =>
        Math.max(0, endsAt - (Date.now() + clockOffset))
    );

    const hasExpiredRef = useRef(false);

    useEffect(() => {
        hasExpiredRef.current = false;

        const tick = () => {
            const correctedNow = Date.now() + clockOffset;
            const diff = Math.max(0, endsAt - correctedNow);

            setRemaining(diff);

            if (diff === 0 && !hasExpiredRef.current) {
                hasExpiredRef.current = true;
                onExpire?.();
            }
        };

        tick(); // chạy ngay lần đầu, không đợi 1s
        const id = setInterval(tick, 1000);

        return () => clearInterval(id);
    }, [endsAt, clockOffset, onExpire]);

    // Format tiện dùng luôn
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return {
        remaining,       // ms còn lại (raw)
        minutes,
        seconds,
        isExpired: remaining === 0,
    };
}