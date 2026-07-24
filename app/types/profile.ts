export type ProfileUncheckedCreateInput = {
    id: string
    fullName?: string | null
    email: string
    avatarUrl?: string | null
    avatarKey?: string | null
    companyName?: string | null
    age?: number | null
    programme?: string | null
    university?: string | null
    degree?: string | null
    instagram?: string | null
    facebook?: string | null
    linkedIn?: string | null
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
}