/**
 * PURPOSE:
 * Renders the full profile edit form using react-hook-form.
 * Wrapped in React.memo to avoid re-renders when parent state updates.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from UserDashboardClient.tsx.
 * Mounted inside the Profile Card section of the dashboard.
 */

"use client";

import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { ProfileUpdationDto } from "@/app/types/profile";
import { ProfileUncheckedCreateInput } from "@/app/types";
import { designTokens } from "@/app/constants/design-tokens";

interface ProfileFormProps {
  profile: ProfileUncheckedCreateInput | null;
  isLoading: boolean;
  onSubmit: (data: ProfileUpdationDto) => Promise<void>;
}

const ProfileForm = memo(function ProfileForm({ profile, isLoading, onSubmit }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdationDto>({
    defaultValues: {
      id: profile?.id || "",
      fullName: profile?.fullName || "",
      age: profile?.age || 20,
      programme: profile?.programme || "",
      university: profile?.university || "",
      degree: profile?.degree || "",
      instagram: profile?.instagram || "",
      facebook: profile?.facebook || "",
      linkedIn: profile?.linkedIn || "",
      description: profile?.description || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            className={`h-11 px-3.5 border ${errors.fullName ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && (
            <p className={`text-xs ${designTokens.colors.text.error}`}>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email (Disabled) */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Email (Cannot be changed)
          </label>
          <input
            type="email"
            value={profile?.email || ""}
            disabled
            className={`h-11 px-3.5 border border-neutral-200 ${designTokens.radii.input} bg-neutral-100 text-neutral-500 cursor-not-allowed text-sm`}
          />
        </div>

        {/* Age */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Age
          </label>
          <input
            type="number"
            placeholder="Enter age"
            className={`h-11 px-3.5 border ${errors.age ? designTokens.colors.border.error : designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("age", {
              required: "Age is required",
              min: { value: 1, message: "Age must be positive" },
            })}
          />
          {errors.age && (
            <p className={`text-xs ${designTokens.colors.text.error}`}>{errors.age.message}</p>
          )}
        </div>

        {/* Programme */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Programme
          </label>
          <input
            type="text"
            placeholder="Enter programme"
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("programme")}
          />
        </div>

        {/* University */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            University
          </label>
          <input
            type="text"
            placeholder="Enter university"
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("university")}
          />
        </div>

        {/* Degree */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Degree
          </label>
          <input
            type="text"
            placeholder="Enter degree"
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("degree")}
          />
        </div>

        {/* Instagram Link */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Instagram Profile Link
          </label>
          <input
            type="text"
            placeholder="https://instagram.com/..."
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("instagram")}
          />
        </div>

        {/* Facebook Link */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            Facebook Profile Link
          </label>
          <input
            type="text"
            placeholder="https://facebook.com/..."
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("facebook")}
          />
        </div>

        {/* LinkedIn Link */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
            LinkedIn Profile Link
          </label>
          <input
            type="text"
            placeholder="https://linkedin.com/in/..."
            className={`h-11 px-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm`}
            {...register("linkedIn")}
          />
        </div>
      </div>

      {/* Description Textarea */}
      <div className="flex flex-col gap-1.5">
        <label className={`text-sm font-semibold ${designTokens.colors.text.primary}`}>
          Short Description
        </label>
        <textarea
          rows={3}
          placeholder="Tell us a little bit about yourself..."
          className={`p-3.5 border ${designTokens.colors.border.default} ${designTokens.radii.input} outline-none ${designTokens.colors.border.focus} transition text-sm resize-y`}
          {...register("description")}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`self-end px-6 h-11 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 text-sm`}
      >
        Save Profile Changes
      </button>
    </form>
  );
});

export default ProfileForm;
