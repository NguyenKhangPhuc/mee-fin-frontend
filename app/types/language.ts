export type LanguageUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
}

export interface LanguageCreationDto {
    name: string;
}

export interface LanguageDeleteDto {
    id: string;
}