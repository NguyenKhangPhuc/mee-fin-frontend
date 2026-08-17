/**
 * PURPOSE:
 * Server Component page handler for the /about route.
 * 100% pure Server Component (no client hooks or 'use client') providing an SEO-optimized overview
 * of MeeFins' mission, founder origin story (learning Finnish at Oulu University), platform features,
 * non-commercial vision, and feedback support.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /about in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (route page).
 */

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { designTokens } from "../constants/design-tokens";

export const metadata: Metadata = {
  title: "About MeeFins - Global Peer Language Exchange & Cultural Connection",
  description:
    "Discover MeeFins: A non-commercial peer-to-peer language exchange platform created by Phuc Nguyen, a student at Oulu University, to foster global cultural exchange and smooth language practice.",
  keywords: [
    "About MeeFins",
    "Language Exchange Mission",
    "Phuc Nguyen",
    "Oulu University",
    "Peer Language Learning",
    "Learn Finnish",
    "Non-commercial Platform",
  ],
  openGraph: {
    title: "About MeeFins - Global Peer Language Exchange Platform",
    description:
      "Learn about MeeFins' mission to promote global cultural exchange and peer-to-peer language practice.",
    siteName: "MeeFins",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About MeeFins",
    url: "https://mee-fins.com/about",
    description:
      "MeeFins is a non-commercial peer-to-peer language exchange platform created by Phuc Nguyen at Oulu University to foster global cultural exchange.",
    mainEntity: {
      "@type": "WebApplication",
      name: "MeeFins",
      applicationCategory: "EducationalApplication",
      author: {
        "@type": "Person",
        name: "Phuc Nguyen",
        email: "Phuc.Nguyen@student.oulu.fi",
        affiliation: {
          "@type": "EducationalOrganization",
          name: "Oulu University",
        },
      },
    },
  };

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={`min-h-screen ${designTokens.colors.bg.page} font-sans flex flex-col gap-12 sm:gap-16 lg:gap-20 px-3 sm:px-6 lg:px-8 py-8 sm:py-12`}>
        <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-24">

          {/* ===== HEADER & HERO SECTION ===== */}
          <header className="flex flex-col items-start gap-5 pt-2 sm:pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8ede6] border border-[#dfccc1] text-[#82301c] text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#82301c] animate-pulse" />
              Non-Commercial Cultural Exchange Initiative
            </div>

            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight ${designTokens.colors.text.primary} leading-[1.15]`}>
              Connecting Cultures & Accelerating Language Fluency
            </h1>

            <p className={`text-base sm:text-lg ${designTokens.colors.text.secondary} leading-relaxed max-w-3xl`}>
              MeeFins was built to promote peer-to-peer cultural exchange worldwide on a completely non-commercial basis. Our goal is to connect passionate learners, remove financial barriers to language practice, and create an inclusive global community.
            </p>
          </header>

          {/* ===== ORIGIN STORY SECTION ===== */}
          <section className="w-full">
            <div className={`p-6 sm:p-10 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-6`}>
              <div className="flex flex-col gap-2 border-b border-[#dfccc1] pb-4">
                <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
                  The Origin Story
                </span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold ${designTokens.colors.text.primary}`}>
                  Why MeeFins Was Born
                </h2>
              </div>

              <div className={`flex flex-col gap-4 text-sm sm:text-base ${designTokens.colors.text.secondary} leading-relaxed`}>
                <p>
                  Learning a new language is one of the most rewarding journeys a person can take, but it can also be incredibly challenging and exhausting. After mastering English, creator <strong>Phuc Nguyen</strong> embarked on learning <strong>Finnish</strong>. During this process, finding consistent practice partners and native speakers to converse with proved to be a major hurdle.
                </p>
                <p>
                  Recognizing that thousands of students and language enthusiasts face the exact same struggle every day, Phuc decided to build <strong>MeeFins</strong>. The platform was created so that anyone, anywhere in the world, can easily connect with exchange partners, schedule structured sessions, practice live, and build vocabulary together.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div className="flex flex-col">
                  <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
                    Founder Spotlight
                  </span>
                  <span className={`text-sm sm:text-base font-bold ${designTokens.colors.text.primary}`}>
                    Phuc Nguyen — Student at Oulu University
                  </span>
                </div>
                <a
                  href="mailto:Phuc.Nguyen@student.oulu.fi"
                  className="text-xs sm:text-sm font-bold text-[#82301c] hover:underline flex items-center gap-1.5 w-fit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phuc.Nguyen@student.oulu.fi
                </a>
              </div>
            </div>
          </section>

          {/* ===== CORE PLATFORM CAPABILITIES ===== */}
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted} bg-[#f8ede6] border border-[#dfccc1] px-3 py-1 rounded-full w-fit`}>
                Core Capabilities
              </span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold ${designTokens.colors.text.primary} tracking-tight`}>
                Complete Platform Features
              </h2>
              <p className={`text-sm sm:text-base ${designTokens.colors.text.secondary}`}>
                MeeFins equips language learners with a comprehensive suite of interactive tools:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1: Personal Profiles */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Personal Profiles & Levels
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Create personal profiles highlighting native and target languages with exact proficiency levels (Beginner, Intermediate, Advanced) and academic background.
                  </p>
                </div>
              </article>

              {/* Feature 2: 1-Click Slot Bookings & Emails */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    1-Click Slot Booking & Email Alerts
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Schedule open exchange slots on an interactive calendar. Automated email notifications immediately alert hosts when another member books a session.
                  </p>
                </div>
              </article>

              {/* Feature 3: Real-Time Video Calling */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Real-Time HD Video Calls
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Join low-latency 1-on-1 video and audio rooms powered by LiveKit. Conduct conversation exchanges directly from your browser without third-party apps.
                  </p>
                </div>
              </article>

              {/* Feature 4: Vocabulary Storage */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    In-Room & Out-of-Room Vocabulary Storage
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Capture vocabulary items on the fly during live video sessions or save words outside rooms, categorizing them into organized language collections.
                  </p>
                </div>
              </article>

              {/* Feature 5: Flashcard Practice */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Interactive Flashcard Decks
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Play around with your custom vocabulary collections! Use interactive flashcard practice to test recall and master new terminology over time.
                  </p>
                </div>
              </article>

              {/* Feature 6: Peer Ratings */}
              <article className={`p-6 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Peer Ratings & Search Rankings
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Rate and review learning partners after sessions. Positive ratings boost active, helpful members to the top of community directory searches.
                  </p>
                </div>
              </article>
            </div>
          </section>

          {/* ===== FUTURE ROADMAP & FEEDBACK SUPPORT CARD ===== */}
          <section className="w-full">
            <div className={`p-8 sm:p-12 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-8`}>
              <div className="flex flex-col gap-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
                  Looking Ahead
                </span>
                <h2 className={`text-2xl sm:text-4xl font-extrabold ${designTokens.colors.text.primary} tracking-tight`}>
                  Future Roadmap & Continuous Development
                </h2>
                <p className={`text-sm sm:text-base ${designTokens.colors.text.secondary} leading-relaxed`}>
                  MeeFins is continuously evolving. We will keep developing and releasing new features in the future to make your language exchange journey smoother, richer, and more engaging.
                </p>
              </div>

              {/* Bug Reporting & Wishing Card */}
              <div className="p-6 rounded-2xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className={`text-base sm:text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Found a Bug or Have Feedback?
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary}`}>
                    If you encounter any bugs, glitches, or have suggestions for improvement, please send an email directly to the developer:
                  </p>
                  <a
                    href="mailto:Phuc.Nguyen@student.oulu.fi"
                    className="text-xs sm:text-sm font-bold text-[#82301c] hover:underline flex items-center gap-1.5 w-fit mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Phuc.Nguyen@student.oulu.fi
                  </a>
                </div>

                <div className="flex flex-col items-start md:items-end text-left md:text-right shrink-0">
                  <span className={`text-sm sm:text-base font-extrabold ${designTokens.colors.text.primary}`}>
                    Have a great & joyful experience!
                  </span>
                  <span className={`text-xs ${designTokens.colors.text.muted} font-medium mt-0.5`}>
                    Thank you for being part of MeeFins.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/community"
                  className={`px-6 py-3 ${designTokens.radii.button} ${designTokens.colors.bg.buttonPrimary} text-white font-bold text-sm cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Explore Community
                </Link>
                <Link
                  href="/"
                  className={`px-6 py-3 ${designTokens.radii.button} ${designTokens.colors.bg.buttonSecondary} font-bold text-sm cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
