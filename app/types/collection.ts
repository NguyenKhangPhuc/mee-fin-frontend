import { LanguageUncheckedCreateInput } from "./language"
import { VocabularyWordUncheckedCreateInput } from "./word"

export type VocabularyCollectionUncheckedCreateInput = {
    id?: string
    ownerId: string
    name: string
    description?: string | null
    languageId: string
    language: LanguageUncheckedCreateInput,
    createdAt?: Date | string
    updatedAt?: Date | string
    words?: VocabularyWordUncheckedCreateInput[]
}