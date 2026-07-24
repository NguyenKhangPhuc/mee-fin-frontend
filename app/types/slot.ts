import { SlotStatus } from "./enum"

export type SlotUncheckedCreateInput = {
    id?: string
    title: string
    startTime: Date | string
    durationMinutes: number
    status?: SlotStatus
    provideLanguageId: string
    exchangeLanguageId: string
    ownerId: string
    exchangeUserId?: string | null
    bookedAt?: Date | string | null
    roomId?: string
    videoRecordUrl?: string | null
    videoExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
}