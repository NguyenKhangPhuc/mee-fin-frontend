"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginService, githubService, googleService, generateSignUpCodeService } from "@/app/services";
import { LoginDto } from "@/app/types/authentication";
import { designTokens } from "@/app/constants/design-tokens";
import { USER_NOT_VERIFIED } from "@/app/constants/error-code";
import { useNotification } from "@/app/context/NotificationContext";

type LoginFormData = LoginDto & {
  isTermAccepted: boolean;
};

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

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginClient() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    if (!data.isTermAccepted) {
      showNotification("You must accept the Terms and Privacy Policy to continue", "error");
      return;
    }

    setIsLoading(true);
    setServerError(null);
    setIsNotVerified(false);
    try {
      const { data: resData, error, errorCode } = await loginService(data);
      if (error) {
        setServerError(error);
        if (errorCode === USER_NOT_VERIFIED) {
          setIsNotVerified(true);
        }
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setServerError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    const email = getValues("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim() || !emailRegex.test(email)) {
      setServerError("Please enter a valid email address to verify your account.");
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await generateSignUpCodeService({ email });
      if (error) {
        setServerError(error);
        return;
      }
      showNotification("Verification code is sent successfully.", "success");
      router.push(`/sign-up/verify?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setServerError("Failed to send verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    const isTermAccepted = getValues("isTermAccepted");
    if (!isTermAccepted) {
      showNotification("You must accept the Terms and Privacy Policy to continue", "error");
      return;
    }

    setIsGoogleLoading(true);
    setServerError(null);
    try {
      const { data: resData } = await googleService();
      if (resData?.url) {
        window.location.href = resData.url;
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        window.location.href = `${apiUrl}/auth/google`;
      }
    } catch (err: unknown) {
      setServerError("Failed to initialize Google login.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLoginWithGithub = async () => {
    const isTermAccepted = getValues("isTermAccepted");
    if (!isTermAccepted) {
      showNotification("You must accept the Terms and Privacy Policy to continue", "error");
      return;
    }

    setIsGithubLoading(true);
    setServerError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      window.location.href = `${apiUrl}/auth/github`;
    } catch (err: unknown) {
      setServerError("Failed to initialize Github login.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className={`p-5 flex flex-col justify-center items-center min-h-screen ${designTokens.colors.bg.page}`}>
      <form
        className={`flex flex-col gap-3 ${designTokens.colors.bg.card} ${designTokens.shadows.card} transition-all duration-300 p-8 w-full max-w-[450px] ${designTokens.radii.card} font-sans`}
        onSubmit={handleSubmit(onLoginSubmit)}
      >
        <div className="flex flex-col items-center mb-4">
          <h1 className={`text-2xl font-bold tracking-tight ${designTokens.colors.text.primary}`}>
            Welcome Back
          </h1>
          <p className={`text-sm mt-1 ${designTokens.colors.text.secondary}`}>
            Please enter your credentials to sign in
          </p>
        </div>

        {serverError && (
          <div className="p-3 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
            <div>{serverError}</div>
            {isNotVerified && (
              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={isVerifying}
                className="mt-2 text-sm font-semibold text-[#82301c] hover:underline cursor-pointer disabled:opacity-50 block"
              >
                {isVerifying ? "Sending code..." : "Verify your account?"}
              </button>
            )}
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

        <div className="flex flex-col mt-2">
          <label className={`text-sm font-semibold mb-1 ${designTokens.colors.text.primary}`}>
            Password
          </label>
          <div
            className={`border ${errors.password ? designTokens.colors.border.error : designTokens.colors.border.default
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
                  message: "Password must be above 8 characters",
                },
              })}
            />
          </div>
          {errors.password && (
            <p className={`text-sm mt-1 ${designTokens.colors.text.error}`}>
              {errors.password.message}
            </p>
          )}
          <div className="flex justify-end mt-1">
            <Link
              href="/forget-password"
              className={`text-xs ${designTokens.colors.text.primary} hover:underline font-semibold`}
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Terms & Privacy Policy Checkbox */}
        <div className="flex flex-col mt-4">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="isTermAccepted"
              className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
              {...register("isTermAccepted", {
                required: "You must accept the Terms and Privacy Policy to continue"
              })}
            />
            <label htmlFor="isTermAccepted" className="text-sm text-[#151717] cursor-pointer leading-tight font-roboto-mono">
              I have read and agree to the{" "}
              <Link href="/terms-and-conditions" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                Privacy Policy
              </Link>.
            </label>
          </div>

          {errors.isTermAccepted && (
            <p className="text-red-500 text-xs mt-1 font-roboto-mono">
              {errors.isTermAccepted.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 h-12 flex items-center justify-center font-medium ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50`}
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className={`border-t ${designTokens.colors.border.default} w-full`} />
          <span className={`absolute px-3 ${designTokens.colors.bg.card} text-xs ${designTokens.colors.text.muted}`}>
            OR
          </span>
        </div>

        {/* Login with Google Button */}
        <button
          type="button"
          onClick={handleLoginWithGoogle}
          disabled={isGoogleLoading}
          className={`h-12 flex items-center justify-center gap-2 border ${designTokens.colors.border.default} ${designTokens.colors.bg.buttonSecondary} ${designTokens.colors.text.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer disabled:opacity-50 font-medium ${designTokens.shadows.button}`}
        >
          <GoogleIcon />
          <span>{isGoogleLoading ? "Connecting..." : "Login with Google"}</span>
        </button>

        {/* Login with Github Button */}
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
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-neutral-900 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
