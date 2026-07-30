/**
 * PURPOSE:
 * Server Component page handler for the /community route.
 * Concurrently fetches current user session and initial paginated community profiles (page 1, limit 10),
 * then renders the interactive CommunityClient presentation component.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /community in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (route page).
 */

import getUser from "../services/auth/user";
import { getAllUserProfileWithLanguagesAndSlots } from "../services/profile/get-all-user";
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  const [{ data: currentUser }, { data: profilesResponse }] = await Promise.all([
    getUser(),
    getAllUserProfileWithLanguagesAndSlots({ page: 1, limit: 5 }),
  ]);

  return (
    <CommunityClient
      currentUser={currentUser}
      initialProfiles={profilesResponse?.data || []}
      initialMeta={
        profilesResponse?.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        }
      }
    />
  );
}
