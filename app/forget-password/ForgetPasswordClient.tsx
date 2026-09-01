"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { generateForgetPasswordCodeService } from "@/app/services";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";

interface ForgetPasswordFormValues {
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

export default function ForgetPasswordClient() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>();

  const onForgetPasswordSubmit = async (formData: ForgetPasswordFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await generateForgetPasswordCodeService({
        email: formData.email,
      });

      if (error) {
        setServerError(error);
        return;
      }

      showNotification("Code has been sent successfully.", "success");
      router.push(`/reset-password?email=${encodeURIComponent(formData.email)}`);
    } catch (err: unknown) {
      setServerError("Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-5 flex flex-col justify-center items-center min-h-screen ${designTokens.colors.bg.page}`}>
      <form
        className={`flex flex-col gap-3 ${designTokens.colors.bg.card} ${designTokens.shadows.card} transition-all duration-300 p-8 w-full max-w-[450px] ${designTokens.radii.card} font-sans`}
        onSubmit={handleSubmit(onForgetPasswordSubmit)}
      >
        <div className="flex flex-col items-center mb-4 text-center">
          <h1 className={`text-2xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Forgot Password
          </h1>
          <p className={`text-sm mt-1 ${designTokens.colors.text.secondary}`}>
            Enter your email address to receive a verification code
          </p>
        </div>

        {serverError && (
          <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
            {serverError}
          </div>
        )}

        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Email
          </label>
          <div
            className={`border ${errors.email ? designTokens.colors.border.error : designTokens.colors.border.default
              } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <EmailIcon />
            <input
              type="text"
              placeholder="Enter your Email"
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid Email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 h-12 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </button>

        <p className={`text-center text-sm mt-3 ${designTokens.colors.text.secondary}`}>
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
