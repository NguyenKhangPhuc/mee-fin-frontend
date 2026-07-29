/**
 * PURPOSE:
 * Server Component page for the /collection route.
 * Fetches user vocabulary collections and platform languages on the server,
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
import CollectionClient from "./CollectionClient";

export default async function CollectionPage() {
  const [{ data: collections }, { data: languages }] = await Promise.all([
    getAllUserCollections(),
    getAllLanguages(),
  ]);

  return (
    <CollectionClient
      initialCollections={collections || []}
      allLanguages={languages || []}
    />
  );
}
