import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "./context/LoaderContext";
import { NotificationProvider } from "./context/NotificationContext";
import NavbarServer from "./components/NavbarServer";
import { designTokens } from "./constants/design-tokens";

import NotificationCard from "./components/NotificationCard";
import Loader from "./components/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEE-FINS - Financial Portal",
  description: "MEE-FINS Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <LoaderProvider>
        <NotificationProvider>
          <body
            className={`antialiased min-h-screen ${designTokens.colors.bg.page} ${designTokens.colors.text.primary} flex flex-col xl:flex-row`}
          >
            <NavbarServer />
            <div className="flex-grow flex flex-col min-w-0 xl:pl-72 transition-all duration-300">
              <main className="flex-1 flex flex-col">{children}</main>
            </div>
            <NotificationCard />
            <Loader />
          </body>
        </NotificationProvider>
      </LoaderProvider>
    </html>
  );
}
