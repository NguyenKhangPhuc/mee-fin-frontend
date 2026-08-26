/**
 * PURPOSE:
 * Renders the Privacy Policy page for MeeFins.
 * Explains how personal data is collected, stored, processed, and protected across slot bookings,
 * LiveKit video practice sessions, vocabulary flashcards, cookie authentication, secure remote server hosting,
 * and compliance with the General Data Protection Regulation (GDPR).
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /privacy-policy in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { designTokens } from "@/app/constants/design-tokens";

/**
 * PrivacyPolicyPage
 *
 * BEHAVIORAL MECHANISM:
 * Renders a structured privacy policy document animated using framer-motion stagger variants.
 * Explicitly details secure remote server infrastructure and comprehensive GDPR rights compliance.
 *
 * PARAMETERS:
 * None.
 *
 * RETURNS:
 * - JSX.Element: The animated Privacy Policy page.
 */
export default function PrivacyPolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const sections = [
    {
      id: "privacy-1",
      number: "1",
      title: "Secure Remote Server Hosting & Infrastructure",
      content:
        "MeeFins services, databases, and authentication endpoints are hosted on a secure remote server infrastructure equipped with enterprise-grade security standards:",
      bullets: [
        "End-to-End Transport Encryption: All data in transit between your browser and our secure remote servers is encrypted using standard TLS/SSL (HTTPS) protocols.",
        "Protected Remote Storage: User accounts, hashed credentials, slot bookings, and custom vocabulary decks are stored on hardened, firewall-protected remote server environments.",
        "Secure WebRTC Rooms: 1-on-1 video and audio practice sessions run on dedicated, isolated LiveKit media servers without persistent video cloud recording.",
      ],
    },
    {
      id: "privacy-2",
      number: "2",
      title: "General Data Protection Regulation (GDPR) Compliance",
      content:
        "MeeFins fully adheres to the European Union General Data Protection Regulation (GDPR). We process personal data strictly under lawful bases (Article 6 GDPR) for contract performance to deliver peer-to-peer language exchange services.",
      bullets: [
        "Lawful Basis & Purpose Limitation: Data is collected exclusively to authenticate users, manage language exchange slots, connect LiveKit rooms, and store study flashcards.",
        "Data Minimization: We store only the minimum essential information required to operate your account and study tools.",
        "No Commercial Exploitation: Personal data is never sold, leased, or monetized for advertising or tracking purposes.",
      ],
    },
    {
      id: "privacy-3",
      number: "3",
      title: "Your GDPR Data Subject Rights",
      content:
        "Under GDPR, as a data subject, you possess the following explicit rights regarding your personal information processed on MeeFins:",
      bullets: [
        "Right of Access (Article 15 GDPR): The right to request confirmation of whether your personal data is being processed and to receive a copy of your account profile, scheduled slots, and flashcards.",
        "Right to Rectification (Article 16 GDPR): The right to update or correct inaccurate or incomplete profile information (such as display name, avatar URL, or timezone).",
        "Right to Erasure / Right to be Forgotten (Article 17 GDPR): The right to request permanent deletion of your account, meeting logs, ratings, and custom vocabulary collections.",
        "Right to Restriction of Processing (Article 18 GDPR): The right to request temporary restriction of your data processing under specific dispute circumstances.",
        "Right to Data Portability (Article 20 GDPR): The right to receive an export of your created vocabulary decks and account activity in a structured, machine-readable format.",
        "Right to Object (Article 21 GDPR): The right to object to data processing activities based on legitimate interests.",
      ],
    },
    {
      id: "privacy-4",
      number: "4",
      title: "Information We Collect",
      content:
        "We collect only the essential categories of personal information needed for platform operations:",
      bullets: [
        "Account Data: Email address, display name, profile picture URL, timezone setting, and encrypted password hash (or GitHub OAuth identifier).",
        "Learning & Practice Data: Custom vocabulary collections, word lists, scheduled 1-on-1 language exchange slot records, meeting history, and partner ratings.",
        "Technical Session Data: Ephemeral LiveKit room credentials and secure HTTP-only JWT cookies (access_token and refresh_token).",
      ],
    },
    {
      id: "privacy-5",
      number: "5",
      title: "Cookies & Session Security",
      content:
        "MeeFins uses secure HTTP-only cookies to manage authentication tokens (access_token and refresh_token). HTTP-only cookies cannot be accessed via browser JavaScript, safeguarding your session against Cross-Site Scripting (XSS) attacks. Cookies automatically expire upon session timeout or logout.",
    },
    {
      id: "privacy-6",
      number: "6",
      title: "Third-Party Service Providers",
      content:
        "We engage trusted third-party technology providers strictly to fulfill operational features:",
      bullets: [
        "LiveKit Media Server: Handles real-time WebRTC audio and video streaming during language exchange meetings without cloud stream recording.",
        "GitHub OAuth: Provides optional single sign-on authentication when logging in with your GitHub account.",
      ],
    },
    {
      id: "privacy-7",
      number: "7",
      title: "GDPR Data Controller & Contact Information",
      content:
        "If you wish to exercise any of your GDPR rights, request data export or account deletion, or ask privacy questions, please contact our Data Controller at:",
      contactEmail: "phuc.nguyen@student.oulu.fi",
    },
  ];

  return (
    <div
      className={`min-h-screen ${designTokens.colors.bg.page} p-4 sm:p-8 md:p-12 font-sans select-none flex flex-col items-center`}
    >
      <motion.div
        className="w-full max-w-4xl space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Navigation Breadcrumb */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition cursor-pointer hover:opacity-90`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <span className={`text-xs ${designTokens.colors.text.muted}`}>
            Last Updated: August 26, 2026
          </span>
        </motion.div>

        {/* Header Hero Banner */}
        <motion.div
          variants={itemVariants}
          className={`p-6 sm:p-10 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} space-y-4`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#82301c]/10 text-[#82301c] border border-[#82301c]/20">
            GDPR & Privacy Statement
          </div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${designTokens.colors.text.primary}`}>
            Privacy Policy & GDPR Compliance
          </h1>
          <p className={`text-sm sm:text-base ${designTokens.colors.text.secondary} leading-relaxed`}>
            Learn how MeeFins protects your privacy, operates on a secure remote server, and guarantees your rights under the General Data Protection Regulation (GDPR).
          </p>
        </motion.div>

        {/* Core Commitments Grid */}
        <motion.div
          variants={itemVariants}
          className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} space-y-4`}
        >
          <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
            Our Core Privacy & Security Guarantees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#f5e9e2]/60 border border-[#dfccc1] space-y-1">
              <h3 className="font-bold text-[#82301c]">Secure Remote Server</h3>
              <p className={designTokens.colors.text.secondary}>
                Hosted on firewall-protected remote servers with TLS/SSL encryption and HTTP-only cookie tokens.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f5e9e2]/60 border border-[#dfccc1] space-y-1">
              <h3 className="font-bold text-[#82301c]">Full GDPR Compliance</h3>
              <p className={designTokens.colors.text.secondary}>
                Complete support for data access, rectification, erasure, portability, and restriction under EU GDPR law.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f5e9e2]/60 border border-[#dfccc1] space-y-1">
              <h3 className="font-bold text-[#82301c]">Zero Commercial Sale</h3>
              <p className={designTokens.colors.text.secondary}>
                Your data is strictly processed for language exchange sessions and never sold to third parties.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="space-y-6">
          {sections.map((sec) => (
            <motion.div
              key={sec.id}
              id={sec.id}
              variants={itemVariants}
              className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} space-y-4 hover:border-[#82301c]/40 transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#82301c] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {sec.number}
                </div>
                <h2 className={`text-lg sm:text-xl font-bold ${designTokens.colors.text.primary}`}>
                  {sec.title}
                </h2>
              </div>

              <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                {sec.content}
              </p>

              {sec.bullets && (
                <ul className="space-y-2.5 pt-2 pl-2">
                  {sec.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#61514d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#82301c] mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.contactEmail && (
                <div className="pt-3">
                  <a
                    href={`mailto:${sec.contactEmail}`}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} transition hover:opacity-95 shadow-xs`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{sec.contactEmail}</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Navigation */}
        <motion.div
          variants={itemVariants}
          className={`p-6 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs`}
        >
          <span className={designTokens.colors.text.muted}>
            Need to review our Terms & Conditions?
          </span>
          <Link
            href="/terms-and-conditions"
            className={`px-4 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition hover:opacity-90 flex items-center gap-2`}
          >
            <span>Read Terms & Conditions</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
