import { SlotUncheckedCreateInput } from "./slot";
import { UserLanguageUncheckedCreateInput } from "./user_language";

export type ProfileUncheckedCreateInput = {
    id: string;
    fullName?: string | null;
    email: string;
    avatarUrl?: string | null;
    publicAvatarUrl?: string | null;
    avatarKey?: string | null;
    companyName?: string | null;
    age?: number | null;
    programme?: string | null;
    university?: string | null;
    degree?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    linkedIn?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userlanguage?: UserLanguageUncheckedCreateInput[]
    provideSlots?: SlotUncheckedCreateInput[]
    exchangeSlots?: SlotUncheckedCreateInput[]
};

export interface ProfileUpdationDto {
    id: string;
    fullName: string;
    programme?: string;
    university?: string;
    degree?: string;
    facebook: string;
    instagram: string;
    linkedIn: string;
    description: string;
    age: number;
}

export interface ProfileImageUpdationDto {
    poster: File | Blob;
    oldPosterKey?: string;
}

export interface ProfileResponse {
    success: boolean;
    message?: string;
    profile?: ProfileUncheckedCreateInput;
}