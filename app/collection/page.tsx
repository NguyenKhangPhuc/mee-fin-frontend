/**
 * PURPOSE:
 * Server Component page handler for the /collection route.
 * Fetches user vocabulary collections, platform languages, and user session concurrently on the server,
 * then renders the interactive CollectionClient presentation component.
 *
 * CONTEXT/PARENT FILE:
 * Route entry point for /collection in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (Next.js Page component).
 */

import { getAllUserCollections } from "@/app/services/collections";
import { getAllLanguages } from "@/app/services/language/get-language";
import { getUser } from "@/app/services/auth/user";
import CollectionClient from "./CollectionClient";

/**
 * CollectionPage
 *
 * BEHAVIORAL MECHANISM:
 * Invokes Promise.all to fetch user collections, platform languages, and user profile
 * asynchronously on the server before rendering the client presentation layer.
 * Passes server-fetched arrays and user object as props to CollectionClient.
 *
 * PARAMETERS:
 * None.
 *
 * RETURNS:
 * - Promise<JSX.Element>: The collection page presentation layout.
 */
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
