/**
 * PURPOSE:
 * Reusable Footer component mounted globally in root layout.
 * Displays MeeFins brand logo, slogan, quick navigation links,
 * terms & privacy policies, and copyright notice.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at bottom of main layout content container in app/layout.tsx.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { designTokens } from '../constants/design-tokens';

const Footer: React.FC = () => {
  return (
    <footer className={`w-full border-t ${designTokens.colors.border.default} ${designTokens.colors.bg.card} mt-auto`}>
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col gap-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info Column */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3.5 w-fit group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#dfccc1] shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/meefins-logo.png"
                  alt="MeeFins Brand Logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <span className={`text-2xl font-black tracking-tight ${designTokens.colors.text.primary}`}>
                MeeFins
              </span>
            </Link>
            <p className={`text-xs sm:text-sm leading-relaxed ${designTokens.colors.text.secondary} max-w-md`}>
              Faster way to learn a new language — Book 1-on-1 exchange slots with just one click and connect with native partners worldwide.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              Navigation
            </span>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className={`${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} transition-colors`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className={`${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} transition-colors`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className={`${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} transition-colors`}
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links Column */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${designTokens.colors.text.primary}`}>
              Legal & Policy
            </span>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/terms"
                  className={`${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} transition-colors`}
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={`${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} transition-colors`}
                >
                  Privacy Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Divider */}
        <div className={`pt-6 border-t ${designTokens.colors.border.default} flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <p className={`text-xs ${designTokens.colors.text.muted} font-medium`}>
            © {new Date().getFullYear()} MeeFins. All rights reserved.
          </p>
          <p className={`text-xs ${designTokens.colors.text.muted} font-medium`}>
            Built with passion for peer-to-peer language learning.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
