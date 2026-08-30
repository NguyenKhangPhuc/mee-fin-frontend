export type UserLanguageUncheckedCreateInput = {
    id?: string
    userId: string
    languageId: string
    proficiency: string
    createdAt?: Date | string
}

export interface UserLanguagesDeleteDto {
    languageId: string;
}
