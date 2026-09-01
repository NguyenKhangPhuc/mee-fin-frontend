"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { verifySignUpCodeService, generateSignUpCodeService } from "@/app/services";
import { designTokens } from "@/app/constants/design-tokens";
import { useNotification } from "@/app/context/NotificationContext";

interface VerifyFormValues {
  code: string;
}

interface VerifyClientProps {
  email: string;
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

export default function VerifyClient({ email }: VerifyClientProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>();

  const onVerifySubmit = async (formData: VerifyFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { error } = await verifySignUpCodeService({
        email,
        code: formData.code,
      });

      if (error) {
        setServerError(error);
        return;
      }

      showNotification("Account verified successfully!", "success");
      router.push("/login");
    } catch (err: unknown) {
      setServerError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setServerError("Email is missing. Please sign up again.");
      return;
    }
    setIsResending(true);
    setServerError(null);
    try {
      const { error } = await generateSignUpCodeService({ email });
      if (error) {
        setServerError(error);
        return;
      }
      showNotification("Verification code has been resent to your email.", "success");
    } catch (err: unknown) {
      setServerError("Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={`p-5 flex flex-col justify-center items-center min-h-screen ${designTokens.colors.bg.page}`}>
      <form
        className={`flex flex-col gap-3 ${designTokens.colors.bg.card} ${designTokens.shadows.card} transition-all duration-300 p-8 w-full max-w-[450px] ${designTokens.radii.card} font-sans`}
        onSubmit={handleSubmit(onVerifySubmit)}
      >
        <div className="flex flex-col items-center mb-4 text-center">
          <h1 className={`text-2xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Verify Your Account
          </h1>
          <p className={`text-sm mt-1 ${designTokens.colors.text.secondary}`}>
            Enter the 8-digit verification code sent to{" "}
            <span className="font-semibold text-neutral-800">{email || "your email"}</span>
          </p>
        </div>

        {serverError && (
          <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
            {serverError}
          </div>
        )}

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

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 h-12 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="flex items-center justify-between text-sm mt-3">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className={`text-sm ${designTokens.colors.text.primary} hover:underline font-semibold disabled:opacity-50 cursor-pointer`}
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
          <Link href="/sign-up" className={`text-sm ${designTokens.colors.text.secondary} hover:underline`}>
            Back to Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
