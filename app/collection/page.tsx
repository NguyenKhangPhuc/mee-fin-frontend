/**
 * PURPOSE:
 * Server Component page for the /collection route.
 * Fetches user vocabulary collections on the server via getAllUserCollections()
 * and renders the interactive CollectionClient presentation component.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /collection in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (route page).
 */

import { getAllUserCollections } from "@/app/services/collections";
import CollectionClient from "./CollectionClient";

export default async function CollectionPage() {
  const { data: collections } = await getAllUserCollections();

  return <CollectionClient initialCollections={collections || []} />;
}
