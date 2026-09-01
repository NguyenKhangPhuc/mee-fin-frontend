"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updatePasswordService } from "@/app/services";
import { PasswordUpdationDto } from "@/app/types/authentication";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";

interface ResetPasswordClientProps {
  email: string;
}

function EmailIcon() {
  return (
    <svg
      className="w-5 h-5 text-neutral-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      className="w-5 h-5 text-neutral-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-5 h-5 text-neutral-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export default function ResetPasswordClient({ email }: ResetPasswordClientProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUpdationDto>({
    defaultValues: {
      email: email,
    },
  });

  const onResetSubmit = async (formData: PasswordUpdationDto) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await updatePasswordService({
        email: email || formData.email,
        code: formData.code,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (error) {
        setServerError(error);
        return;
      }

      showNotification("Password updated successfully!", "success");
      router.push("/login");
    } catch (err: unknown) {
      setServerError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-5 flex flex-col justify-center items-center min-h-screen ${designTokens.colors.bg.page}`}>
      <form
        className={`flex flex-col gap-3 ${designTokens.colors.bg.card} ${designTokens.shadows.card} transition-all duration-300 p-8 w-full max-w-[450px] ${designTokens.radii.card} font-sans`}
        onSubmit={handleSubmit(onResetSubmit)}
      >
        <div className="flex flex-col items-center mb-4 text-center">
          <h1 className={`text-2xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Reset Password
          </h1>
          <p className={`text-sm mt-1 ${designTokens.colors.text.secondary}`}>
            Enter your verification code and update your password
          </p>
        </div>

        {serverError && (
          <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
            {serverError}
          </div>
        )}

        {/* 1. Disabled Email Field */}
        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Email
          </label>
          <div
            className={`border ${designTokens.colors.border.default} ${designTokens.radii.input} h-12 flex items-center px-3 bg-neutral-100 opacity-70 cursor-not-allowed`}
          >
            <EmailIcon />
            <input
              type="text"
              disabled
              value={email}
              className="flex-1 h-full border-none outline-none px-3 bg-transparent text-neutral-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* 2. Code Field (Length = 8) */}
        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Verification Code
          </label>
          <div
            className={`border ${errors.code ? designTokens.colors.border.error : designTokens.colors.border.default
              } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <CodeIcon />
            <input
              type="text"
              placeholder="Enter 8-digit code"
              maxLength={8}
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("code", {
                required: "Verification code is required",
                minLength: {
                  value: 8,
                  message: "Verification code must be exactly 8 digits",
                },
                maxLength: {
                  value: 8,
                  message: "Verification code must be exactly 8 digits",
                },
              })}
            />
          </div>
          {errors.code && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.code.message}
            </p>
          )}
        </div>

        {/* 3. Old Password Field (8 to 100 chars) */}
        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Old Password
          </label>
          <div
            className={`border ${errors.oldPassword ? designTokens.colors.border.error : designTokens.colors.border.default
              } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <LockIcon />
            <input
              type="password"
              placeholder="Enter old password"
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("oldPassword", {
                required: "Old password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Password cannot exceed 100 characters",
                },
              })}
            />
          </div>
          {errors.oldPassword && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* 4. New Password Field (8 to 100 chars) */}
        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            New Password
          </label>
          <div
            className={`border ${errors.newPassword ? designTokens.colors.border.error : designTokens.colors.border.default
              } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <LockIcon />
            <input
              type="password"
              placeholder="Enter new password"
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Password cannot exceed 100 characters",
                },
              })}
            />
          </div>
          {errors.newPassword && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 h-12 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>

        <p className={`text-center text-sm mt-3 ${designTokens.colors.text.secondary}`}>
          Back to{" "}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
