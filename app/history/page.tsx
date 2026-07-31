/**
 * PURPOSE:
 * Server Component page handler for the /history route.
 * Concurrently fetches current user profile and initial meeting slots (page 1, limit 10),
 * then renders the interactive HistoryClient presentation component.
 *
 * CONTEXT/PARENT FILE:
 * Route handler for /history in Next.js App Router.
 *
 * INPUTS / PARAMETERS:
 * None (route page).
 */

import getUser from "@/app/services/auth/user";
import { getAllUserSlots } from "@/app/services/slots/get-user-slots";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const [{ data: currentUser }, { data: slotsResponse }] = await Promise.all([
    getUser(),
    getAllUserSlots({ page: 1, limit: 10 }),
  ]);

  return (
    <HistoryClient
      currentUser={currentUser}
      initialSlots={slotsResponse?.data || []}
      initialMeta={
        slotsResponse?.meta || {
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
