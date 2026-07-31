import { SlotStatus } from "./enum";
import { LanguageUncheckedCreateInput } from "./language";
import { ProfileUncheckedCreateInput } from "./profile";
import { SlotRatingUncheckedCreateInput } from "./ratings";

export type SlotUncheckedCreateInput = {
    id?: string;
    title: string;
    startTime: Date | string;
    endTime: Date | string;
    durationMinutes: number;
    status?: SlotStatus;
    provideLanguageId: string;
    exchangeLanguageId: string;
    ownerId: string;
    exchangeUserId?: string | null;
    bookedAt?: Date | string | null;
    videoRecordUrl?: string | null;
    videoExpiresAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    exchangeLanguage?: LanguageUncheckedCreateInput;
    provideLanguage?: LanguageUncheckedCreateInput;
    slotRatings?: SlotRatingUncheckedCreateInput[];
    owner?: ProfileUncheckedCreateInput;
    exchangeUser?: ProfileUncheckedCreateInput;
};

export interface SlotCreationDto {
    title: string;
    ownerId: string;
    exchangeUserId?: string;
    provideLanguageId: string;
    exchangeLanguageId: string;
    startTime: Date | string;
    endTime: Date | string;
    durationMinutes: number;
}