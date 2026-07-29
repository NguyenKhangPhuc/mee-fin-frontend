import { LanguageUncheckedCreateInput } from "./language"

export type VocabularyCollectionUncheckedCreateInput = {
    id?: string
    ownerId: string
    name: string
    description?: string | null
    languageId: string
    language: LanguageUncheckedCreateInput,
    createdAt?: Date | string
    updatedAt?: Date | string
    words?: VocabularyCollectionUncheckedCreateInput[]
}