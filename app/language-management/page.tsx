/**
 * PURPOSE:
 * Server Component page handler for the /language-management route.
 * Fetches user profile and platform languages concurrently on the server.
 * Validates whether the current user holds the ADMIN role; if unauthorized, renders UnauthorizedCard.
 * Otherwise, renders LanguageManagementClient with pre-fetched languages.
 *
 * CONTEXT/PARENT FILE:
 * Route page for /language-management in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import React from "react";
import { getUser } from "@/app/services/auth/user";
import { getAllLanguages } from "@/app/services/language/get-language";
import { UserRole } from "@/app/types/enum";
import LanguageManagementClient from "./LanguageManagementClient";
import UnauthorizedCard from "./components/UnauthorizedCard";

/**
 * LanguageManagementPage
 *
 * BEHAVIORAL MECHANISM:
 * Uses Promise.all to fetch current user profile and platform languages in parallel.
 * Validates user authentication state and role against UserRole.ADMIN.
 * If user is null or role is not ADMIN, returns UnauthorizedCard error view.
 * Otherwise, passes languages array to LanguageManagementClient presentation component.
 *
 * PARAMETERS:
 * None.
 *
 * RETURNS:
 * - Promise<JSX.Element>: Unauthorized error view or LanguageManagementClient component.
 */
export default async function LanguageManagementPage() {
  const [{ data: user }, { data: languages }] = await Promise.all([
    getUser(),
    getAllLanguages(),
  ]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <UnauthorizedCard />;
  }

  return <LanguageManagementClient initialLanguages={languages || []} />;
}
