/**
 * PURPOSE:
 * Server Component page for the /collection route.
 * Fetches user vocabulary collections, platform languages, and user session on the server,
 * then renders the interactive CollectionClient presentation component.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /collection in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (route page).
 */

import { getAllUserCollections } from "@/app/services/collections";
import { getAllLanguages } from "@/app/services/language/get-language";
import { getUser } from "@/app/services/auth/user";
import CollectionClient from "./CollectionClient";

export default async function CollectionPage() {
  const [{ data: collections }, { data: languages }, { data: currentUser }] = await Promise.all([
    getAllUserCollections(),
    getAllLanguages(),
    getUser(),
  ]);

  return (
    <CollectionClient
      initialCollections={collections || []}
      allLanguages={languages || []}
      currentUser={currentUser || null}
    />
  );
}
