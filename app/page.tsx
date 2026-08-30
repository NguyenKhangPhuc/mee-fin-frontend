/**
 * PURPOSE:
 * Landing Homepage for MeeFins.
 * Fully optimized for SEO with JSON-LD structured data, semantic HTML5 elements,
 * responsive design-tokens styling, split Hero section with larger logo, vector SVGs for features,
 * feature highlights grid, and founder spotlight section.
 *
 * CONTEXT/PARENT FILE:
 * App Router root page at app/page.tsx.
 *
 * INPUTS / PARAMETERS:
 * None (Page Server/Client Component).
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { designTokens } from './constants/design-tokens';

const flagsList = [
  { name: "English", flag: "/flags/en-EN.png", code: "EN" },
  { name: "Vietnamese", flag: "/flags/vi-VIE.png", code: "VI" },
  { name: "Japanese", flag: "/flags/jp-JP.png", code: "JA" },
  { name: "Korean", flag: "/flags/kr-KR.png", code: "KO" },
  { name: "Chinese", flag: "/flags/cn-CN.png", code: "ZH" },
  { name: "French", flag: "/flags/fr-FR.png", code: "FR" },
  { name: "German", flag: "/flags/ge-GE.png", code: "DE" },
  { name: "Swedish", flag: "/flags/se-SE.png", code: "SV" },
  { name: "Finnish", flag: "/flags/fi-FI.png", code: "FI" },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MeeFins',
    url: 'https://mee-fins.com',
    description:
      'Faster way to learn a new language. Book 1-on-1 language exchange slots with just one click, join real-time LiveKit video rooms, and practice custom vocabulary collections.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    author: {
      '@type': 'Person',
      name: 'Phuc Nguyen',
      email: 'Phuc.Nguyen@student.oulu.fi',
      affiliation: {
        '@type': 'EducationalOrganization',
        name: 'Oulu University',
      },
    },
  };

  const handleScrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={`min-h-screen ${designTokens.colors.bg.page} font-sans flex flex-col gap-12 sm:gap-16 lg:gap-24 px-3 sm:px-6 lg:px-8 py-8 sm:py-12`}>
        <div className="w-full max-w-[1800px] mx-auto flex flex-col gap-16 sm:gap-20 lg:gap-28">

          {/* ===== HERO SECTION (SPLIT 2 PARTS) ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-4 sm:pt-8">
            
            {/* Part 1: Left Text & Action Column */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-start gap-6"
            >
              {/* Category Kicker Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8ede6] border border-[#dfccc1] text-[#82301c] text-xs font-bold uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#82301c] animate-pulse" />
                Peer-to-Peer Language Exchange
              </div>

              {/* H1 Main Heading */}
              <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight ${designTokens.colors.text.primary} leading-[1.15]`}>
                Learn New Languages Faster Through 1-on-1 Peer Exchanges
              </h1>

              {/* Introduction Paragraph */}
              <p className={`text-base sm:text-lg ${designTokens.colors.text.secondary} leading-relaxed max-w-2xl`}>
                MeeFins connects passionate language learners around the world for real-time 1-on-1 exchange sessions. Practice speaking natively, share knowledge, and elevate your fluency effortlessly.
              </p>

              {/* Slogan Banner Highlight */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f8ede6] border-l-4 border-l-[#82301c] border border-[#dfccc1] w-full max-w-xl shadow-xs">
                <p className={`text-sm sm:text-base font-bold ${designTokens.colors.text.primary} italic`}>
                  &quot;Faster way to learn new language — Book slots with just one click.&quot;
                </p>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                {/* Button 1: Explore (Smooth scroll to features) */}
                <a
                  href="#features"
                  onClick={handleScrollToFeatures}
                  className={`px-6 py-3.5 ${designTokens.radii.button} ${designTokens.colors.bg.buttonSecondary} font-bold text-sm sm:text-base cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2`}
                >
                  Explore Features
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>

                {/* Button 2: Sign In */}
                <Link
                  href="/login"
                  className={`px-7 py-3.5 ${designTokens.radii.button} ${designTokens.colors.bg.buttonPrimary} text-white font-bold text-sm sm:text-base cursor-pointer shadow-md shadow-[#82301c]/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2`}
                >
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Part 2: Right Brand Logo & Visual Container (Larger Logo) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center items-center relative"
            >
              {/* Background ambient glow */}
              <div className="absolute inset-0 bg-[#82301c]/10 rounded-full blur-3xl transform scale-95 pointer-events-none" />

              {/* Logo Frame Container */}
              <div className={`relative p-8 sm:p-12 ${designTokens.colors.bg.card} border ${designTokens.colors.border.default} ${designTokens.radii.card} ${designTokens.shadows.card} flex flex-col items-center gap-6 group hover:border-[#82301c]/40 transition-all duration-300 w-full max-w-md sm:max-w-lg`}>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#dfccc1] shadow-xl shadow-[#82301c]/15 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/meefins-logo.png"
                    alt="MeeFins Language Exchange Logo"
                    width={384}
                    height={384}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className={`text-2xl sm:text-3xl font-black ${designTokens.colors.text.primary} tracking-tight`}>
                    MeeFins Platform
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold ${designTokens.colors.text.muted}`}>
                    Interactive 1-on-1 Practice & Vocabulary Portal
                  </span>
                </div>
              </div>
            </motion.div>

          </section>

          {/* ===== CURRENTLY PROVIDED LANGUAGES (INFINITE MARQUEE) ===== */}
          <section className="w-full flex flex-col gap-6 py-2 overflow-hidden relative">
            <div className="flex flex-col items-center justify-center text-center gap-2 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82301c]/10 border border-[#82301c]/20 text-[#82301c] text-xs font-extrabold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#82301c] animate-pulse" />
                Currently Provided Languages
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#82301c] tracking-tight">
                Explore Languages Supported on MeeFins
              </h2>
            </div>

            {/* Infinite Marquee Track Container with Gradient Edge Fades */}
            <div className="relative w-full overflow-hidden py-3">
              {/* Left & Right Gradient Blur Mask Overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#f4ebe4] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#f4ebe4] to-transparent z-10 pointer-events-none" />

              {/* Framer Motion Infinite Scrolling Track */}
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: 22,
                  repeat: Infinity,
                }}
                className="flex items-center gap-6 w-max"
              >
                {[...flagsList, ...flagsList, ...flagsList].map((flagItem, idx) => (
                  <div
                    key={`${flagItem.name}-${idx}`}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#fcf7f3] border border-[#dfccc1] shadow-xs hover:border-[#82301c] transition-all shrink-0 group select-none hover:shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#dfccc1] shrink-0 shadow-xs bg-white">
                      <Image
                        src={flagItem.flag}
                        alt={flagItem.name}
                        width={32}
                        height={32}
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <span className="font-bold text-sm text-[#291e1b] group-hover:text-[#82301c] transition">
                      {flagItem.name}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#82301c]/10 text-[#82301c] border border-[#82301c]/20 uppercase">
                      {flagItem.code}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ===== APP DETAILS & FEATURES SECTION ===== */}
          <section id="features" className="flex flex-col gap-10 sm:gap-12 scroll-mt-16">
            
            {/* Section Title Header */}
            <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
              <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted} bg-[#f8ede6] border border-[#dfccc1] px-3 py-1 rounded-full`}>
                Everything You Need
              </span>
              <h2 className={`text-2xl sm:text-4xl font-extrabold ${designTokens.colors.text.primary} tracking-tight`}>
                Powerful Features Built for Effective Language Learning
              </h2>
              <p className={`text-sm sm:text-base ${designTokens.colors.text.secondary}`}>
                Discover how MeeFins combines scheduling, video conferencing, vocabulary decks, and peer ratings into a seamless learning experience.
              </p>
            </div>

            {/* 6 Features Grid Cards (Using clean SVG icons) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Feature 1: Personal Profiles & Levels */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Personal Profiles & Levels
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Showcase your background with personalized profiles. Set your native and target languages with exact proficiency levels (Beginner, Intermediate, Advanced) and academic details.
                  </p>
                </div>
              </motion.article>

              {/* Feature 2: 1-Click Slot Bookings & Email Alerts */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    1-Click Booking & Email Alerts
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Schedule open slots on an interactive calendar. When another member books your session, automated email notifications immediately deliver full room details to your inbox.
                  </p>
                </div>
              </motion.article>

              {/* Feature 3: Real-Time Video Calling */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Real-Time HD Video Calls
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Experience crisp, low-latency 1-on-1 video and audio rooms powered by LiveKit. No third-party downloads required — join your exchange session straight from the browser.
                  </p>
                </div>
              </motion.article>

              {/* Feature 4: In-Room & Out-of-Room Vocabulary Storage */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    In-Room & Global Vocabulary Storage
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Never forget a new word. Capture vocabulary items during live video meetings or browse freely outside rooms, organizing words into tailored collections.
                  </p>
                </div>
              </motion.article>

              {/* Feature 5: Interactive Flashcards & Deck Practice */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Interactive Flashcard Practice
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Play around with your custom vocabulary collections! Use interactive flashcard decks to test memory, reinforce definitions, and track learning mastery over time.
                  </p>
                </div>
              </motion.article>

              {/* Feature 6: Peer Ratings & Search Ranking */}
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`p-6 sm:p-7 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[#82301c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className={`text-lg font-bold ${designTokens.colors.text.primary}`}>
                    Peer Ratings & Search Rankings
                  </h3>
                  <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                    Rate and review your partners after exchange sessions. High ratings boost helpful members to the top of community directory searches, rewarding great language hosts.
                  </p>
                </div>
              </motion.article>

            </div>
          </section>

          {/* ===== FOUNDER / AUTHOR SPOTLIGHT SECTION ===== */}
          <section className="w-full">
            <div className={`p-8 sm:p-10 ${designTokens.colors.bg.card} ${designTokens.radii.card} border ${designTokens.colors.border.default} ${designTokens.shadows.card} flex flex-col md:flex-row items-center gap-8 justify-between`}>
              <div className="flex flex-col gap-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#82301c] uppercase tracking-wider">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f8ede6] border border-[#dfccc1]">
                    Founder & Developer
                  </span>
                </div>
                <h2 className={`text-xl sm:text-3xl font-extrabold ${designTokens.colors.text.primary} tracking-tight`}>
                  Built by Phuc Nguyen — Student at Oulu University
                </h2>
                <p className={`text-xs sm:text-sm ${designTokens.colors.text.secondary} leading-relaxed`}>
                  MeeFins was designed and built by <strong>Phuc Nguyen</strong>, a student from <strong>Oulu University</strong>, with a mission to create an intuitive, structured, and enjoyable platform for peer-to-peer language practice and vocabulary deck building.
                </p>
              </div>

              {/* Contact Card Badge */}
              <div className="p-5 rounded-xl bg-[#f8ede6] border border-[#dfccc1] flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.muted}`}>
                  Contact & Inquiries
                </span>
                <span className={`text-sm font-bold ${designTokens.colors.text.primary}`}>
                  Phuc Nguyen
                </span>
                <a
                  href="mailto:Phuc.Nguyen@student.oulu.fi"
                  className="text-xs font-semibold text-[#82301c] hover:underline flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phuc.Nguyen@student.oulu.fi
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}