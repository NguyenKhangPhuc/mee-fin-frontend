import { VocabularyCollectionUncheckedCreateInput } from "./collection"
import { SlotUncheckedCreateInput } from "./slot"

export type VocabularyWordUncheckedCreateInput = {
    id?: string
    collectionId: string
    collection: VocabularyCollectionUncheckedCreateInput,
    term: string
    meaning: string
    example?: string | null
    note?: string | null
    slotId?: string | null,
    slot: SlotUncheckedCreateInput,
    createdAt?: Date | string
    updatedAt?: Date | string
}