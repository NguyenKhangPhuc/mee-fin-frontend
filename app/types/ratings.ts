import { ProfileUncheckedCreateInput } from "./profile"
import { SlotUncheckedCreateInput } from "./slot"

export interface SlotRatingUncheckedCreateInput {
    id?: string
    slotId: string
    raterId: string
    ratedUserId: string
    rating: number,
    displayName: string,
    feedback?: string | null
    createdAt?: Date | string
    slot?: SlotUncheckedCreateInput,
    rater?: ProfileUncheckedCreateInput,
    ratedUser?: ProfileUncheckedCreateInput
}
