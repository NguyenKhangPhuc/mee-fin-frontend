export type LanguageUncheckedCreateInput = {
    id?: string
    name: string
    logoUrl?: string
    createdAt?: Date | string
    updatedAt?: Date | string
}

export interface LanguageCreationDto {
    name: string;
    logoUrl?: string;
}

export interface LanguageUpdationDto {
    id: string;
    name: string;
    logoUrl?: string;
}

export interface LanguageDeleteDto {
    id: string;
}