"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signupService, githubService } from "@/app/services";
import { SignUpDto } from "@/app/types/authentication";
import { designTokens } from "@/app/constants/design-tokens";

function UserIcon() {
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
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

function PasswordIcon() {
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

function GithubIcon() {
  return (
    <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function SignUpClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDto>();

  const onSignUpSubmit = async (formData: SignUpDto) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const { data: signupData, error } = await signupService(formData);
      if (error || !signupData) {
        setServerError(
          error?.response?.data?.message || "Sign up failed. Please try again."
        );
        return;
      }
      alert("Sign up successfully!");
      router.push("/login");
    } catch (err: unknown) {
      console.error("Sign up error:", err);
      setServerError("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGithub = async () => {
    setIsGithubLoading(true);
    setServerError(null);
    try {
      const { data: resData } = await githubService();
      if (resData?.url) {
        window.location.href = resData.url;
      } else {
        window.location.href = "http://localhost:3001/auth/github";
      }
    } catch (err: unknown) {
      console.error("Github login error:", err);
      setServerError("Failed to initialize Github login.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className={`p-5 flex flex-col justify-center items-center min-h-screen ${designTokens.colors.bg.page}`}>
      <form
        className={`flex flex-col gap-3 ${designTokens.colors.bg.card} ${designTokens.shadows.card} transition-all duration-300 p-8 w-full max-w-[450px] ${designTokens.radii.card} font-sans`}
        onSubmit={handleSubmit(onSignUpSubmit)}
      >
        <div className="flex flex-col items-center mb-4">
          <h1 className={`text-2xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Create an Account
          </h1>
          <p className={`text-sm mt-1 ${designTokens.colors.text.secondary}`}>
            Enter your details to sign up for a new account
          </p>
        </div>

        {serverError && (
          <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
            {serverError}
          </div>
        )}

        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Display Name
          </label>
          <div
            className={`border ${
              errors.displayName ? designTokens.colors.border.error : designTokens.colors.border.default
            } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <UserIcon />
            <input
              type="text"
              placeholder="Enter your Display Name"
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("displayName", {
                required: "Display Name is required",
                minLength: {
                  value: 2,
                  message: "Display Name must be at least 2 characters",
                },
                maxLength: {
                  value: 35,
                  message: "Display Name cannot exceed 35 characters",
                },
              })}
            />
          </div>
          {errors.displayName && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Email
          </label>
          <div
            className={`border ${
              errors.email ? designTokens.colors.border.error : designTokens.colors.border.default
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

        <div className="flex flex-col">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Password
          </label>
          <div
            className={`border ${
              errors.password ? designTokens.colors.border.error : designTokens.colors.border.default
            } ${designTokens.radii.input} h-12 flex items-center px-3 ${designTokens.colors.border.focus} transition`}
          >
            <PasswordIcon />
            <input
              type="password"
              placeholder="Enter your Password"
              className={`flex-1 h-full border-none outline-none px-3 bg-transparent placeholder-neutral-400 ${designTokens.colors.text.primary}`}
              {...register("password", {
                required: "Password is required",
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
          {errors.password && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 h-12 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-neutral-200 w-full" />
          <span className={`absolute px-3 bg-white text-xs ${designTokens.colors.text.muted}`}>
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={handleLoginWithGithub}
          disabled={isGithubLoading}
          className={`h-12 flex items-center justify-center gap-2 border ${designTokens.colors.border.default} ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 font-medium ${designTokens.shadows.button}`}
        >
          <GithubIcon />
          <span>{isGithubLoading ? "Connecting..." : "Login with Github"}</span>
        </button>

        <p className={`text-center text-sm mt-3 ${designTokens.colors.text.secondary}`}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
