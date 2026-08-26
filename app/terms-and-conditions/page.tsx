/**
 * PURPOSE:
 * Renders the Terms & Conditions page for MeeFins.
 * Explains platform usage rules, disclaimer, service description, user responsibilities,
 * content visibility, data privacy, third-party integrations, governing law, and contact information.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /terms-and-conditions in Next.js App Router.
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
 * TermsAndConditionsPage
 *
 * BEHAVIORAL MECHANISM:
 * Renders a structured, accessible document with entrance animations driven by framer-motion.
 * Groups terms into 9 distinct sections following the MeeFins platform terms specification.
 *
 * PARAMETERS:
 * None.
 *
 * RETURNS:
 * - JSX.Element: The animated Terms & Conditions page.
 */
export default function TermsAndConditionsPage() {
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
      id: "section-1",
      number: "1",
      title: "Acceptance of Terms",
      content:
        "By accessing or using MeeFins, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the application.",
    },
    {
      id: "section-2",
      number: "2",
      title: "Description of Service",
      content:
        "MeeFins is a collaborative peer-to-peer platform designed to assist language learners in booking 1-on-1 language exchange slots, joining real-time LiveKit video/audio practice rooms, and managing custom vocabulary flashcard collections. The platform enables members to schedule open practice slots, match learning partners, and leave ratings following practice sessions.",
    },
    {
      id: "section-3",
      number: "3",
      title: "User Registration and Access",
      content:
        "Users may register via Email or GitHub authentication. By registering, you are responsible for maintaining the confidentiality of your account and all activities (such as scheduled slots, meeting logs, saved vocabulary decks, and profile settings) that occur under your profile. The administrator reserves the right to manage or revoke access based on service requirements.",
    },
    {
      id: "section-4",
      number: "4",
      title: "User Content and Public Visibility",
      content:
        "By using the platform, you agree that:",
      bullets: [
        "Vocabulary Decks: Any vocabulary collections, word lists, or custom flashcards created or uploaded will be stored and processed for study and practice features.",
        "Slot Bookings: Slot schedules and language preferences (Provide Language vs Exchange Language) will be displayed to facilitate 1-on-1 partner matching.",
        "Conduct: You are solely responsible for the accuracy and legality of all text, vocabulary entries, and respectful behavior in LiveKit video practice sessions.",
      ],
    },
    {
      id: "section-5",
      number: "5",
      title: "Data Privacy",
      content:
        "We take your privacy seriously. Personal data collection is strictly limited to what is necessary for performing slot matching, session management, LiveKit room token generation, and saved practice history logs.",
    },
    {
      id: "section-6",
      number: "6",
      title: "Third-Party Links & Services",
      content:
        "MeeFins integrates with and provides links to external services such as LiveKit WebRTC media servers and GitHub OAuth providers. We are not responsible for the content, privacy policies, or practices of these third-party services. Accessing these services is at your own risk.",
    },
    {
      id: "section-7",
      number: "7",
      title: "Modifications",
      content:
        "We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the platform following any changes constitutes your acceptance of the new Terms.",
    },
    {
      id: "section-8",
      number: "8",
      title: "Governing Law",
      content:
        "These Terms & Conditions are governed by the laws of Finland (or the jurisdiction in which the application is operated). Any disputes arising from the use of this tool shall be subject to the appropriate legal jurisdiction.",
    },
    {
      id: "section-9",
      number: "9",
      title: "Contact",
      content:
        "If you have any questions or concerns about these Terms & Conditions, please contact us directly at:",
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
            Legal Documentation
          </div>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${designTokens.colors.text.primary}`}>
            Terms & Conditions
          </h1>
          <p className={`text-sm sm:text-base ${designTokens.colors.text.secondary} leading-relaxed`}>
            Please review the terms of service governing your access to and use of the MeeFins language exchange platform.
          </p>
        </motion.div>

        {/* About & Disclaimer Card */}
        <motion.div
          variants={itemVariants}
          className={`p-6 sm:p-8 ${designTokens.colors.bg.card} ${designTokens.shadows.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} space-y-6`}
        >
          <div className="space-y-2">
            <h2 className={`text-xl font-bold ${designTokens.colors.text.primary}`}>
              About MeeFins
            </h2>
            <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
              MeeFins is a peer-to-peer language exchange platform created to help learners practice new languages by connecting directly with native speakers and study partners. This project is developed with the sole purpose of supporting language learners, easing their transition into real-world speaking practice, and boosting their international communication opportunities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Disclaimer
            </h3>
            <p className="text-xs text-amber-950 leading-relaxed">
              We are not responsible for any inaccuracies or errors in the default language datasets or user-generated vocabulary collections available on this website. These default resources are provided strictly as references. You are free to utilize them or upload/create your own custom vocabulary decks and study sources.
            </p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
            Looking for how we handle your personal data?
          </span>
          <Link
            href="/privacy-policy"
            className={`px-4 py-2 text-xs font-semibold ${designTokens.colors.bg.buttonSecondary} ${designTokens.radii.button} transition hover:opacity-90 flex items-center gap-2`}
          >
            <span>Read Privacy Policy</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
