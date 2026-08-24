"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutService } from "@/app/services/auth/logout";
import { SafeUser } from "@/app/types/authentication";
import { UserRole, USER_ROLE } from "@/app/types/enum";
import { designTokens } from "@/app/constants/design-tokens";

function MenuIcon() {
  return (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

interface NavbarMobileProps {
  initialUser: SafeUser | null;
}

const NAV_ITEMS = [
  { title: "HomePage", link: "/", icon: HomeIcon },
  { title: "About", link: "/about", icon: AboutIcon },
  { title: "Dashboard", link: "/dashboard", icon: DashboardIcon },
  { title: "Community", link: "/community", icon: CommunityIcon },
  { title: "Your Collection", link: "/collection", icon: CollectionIcon },
  { title: "Meeting History", link: "/history", icon: HistoryIcon },
];

export default function NavbarMobile({ initialUser }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = initialUser
    ? [
        { title: "HomePage", link: "/", icon: HomeIcon },
        { title: "About", link: "/about", icon: AboutIcon },
        { title: "Dashboard", link: "/dashboard", icon: DashboardIcon },
        { title: "Community", link: "/community", icon: CommunityIcon },
        { title: "Your Collection", link: "/collection", icon: CollectionIcon },
        { title: "Meeting History", link: "/history", icon: HistoryIcon },
        ...(initialUser.role === UserRole.ADMIN
          ? [{ title: "Language Management", link: "/language-management", icon: LanguageIcon }]
          : []),
      ]
    : [
        { title: "HomePage", link: "/", icon: HomeIcon },
        { title: "About", link: "/about", icon: AboutIcon },
      ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="xl:hidden w-full font-sans">
      {/* Fixed Header */}
      <header className={`sticky top-0 left-0 right-0 h-16 ${designTokens.colors.bg.sidebar}/90 backdrop-blur-md border-b ${designTokens.colors.border.default} z-40 px-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#82301c] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#82301c]/20">
            M
          </div>
          <span className={`font-bold tracking-tight text-sm ${designTokens.colors.text.primary}`}>
            MEE-FINS
          </span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className={`p-2 ${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} rounded-lg hover:bg-[#f5e9e2] transition`}
        >
          <MenuIcon />
        </button>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className={`${designTokens.loader.overlay} fixed inset-0 z-50 transition-opacity duration-300`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Full Screen Height & Expanded Width Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 h-screen w-80 sm:w-96 ${designTokens.colors.bg.sidebar} border-l ${designTokens.colors.border.default} z-50 p-6 flex flex-col transition-transform duration-300 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${designTokens.colors.border.default}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#82301c] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#82301c]/20">
              M
            </div>
            <span className={`font-bold tracking-tight text-sm ${designTokens.colors.text.primary}`}>
              MEE-FINS
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className={`p-1.5 ${designTokens.colors.text.secondary} hover:${designTokens.colors.text.primary} rounded-lg hover:bg-[#f5e9e2] transition`}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1.5 flex-grow overflow-y-auto">
          <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${designTokens.colors.text.muted}`}>
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            const Icon = item.icon;
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 ${designTokens.radii.navItem} transition-all text-base font-medium ${isActive
                  ? designTokens.colors.bg.navActive
                  : designTokens.colors.bg.navInactive
                  }`}
              >
                <Icon />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* User Info & Actions */}
        <div className={`mt-auto pt-6 border-t ${designTokens.colors.border.default}`}>
          {initialUser ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-[#f5e9e2] text-[#82301c] border border-[#e8deda] flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                  {initialUser.displayName?.charAt(0) || initialUser.email.charAt(0)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-sm font-semibold truncate ${designTokens.colors.text.primary}`}>
                    {initialUser.displayName || "User"}
                  </span>
                  <span className={`text-xs truncate ${designTokens.colors.text.muted}`}>
                    {initialUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full h-12 flex items-center justify-center gap-2 ${designTokens.colors.bg.buttonDanger} ${designTokens.radii.button} text-sm font-semibold transition cursor-pointer disabled:opacity-50 mt-1`}
              >
                <LogoutIcon />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className={`w-full h-12 flex items-center justify-center gap-2 ${designTokens.colors.bg.buttonPrimary} ${designTokens.colors.text.buttonPrimary} ${designTokens.radii.button} text-sm font-semibold transition`}
            >
              <LoginIcon />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
