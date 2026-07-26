import getUser from "../services/auth/user";
import { getAllUserProfileWithLanguagesAndSlots } from "../services/profile/get-all-user";
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  const [{ data: currentUser }, { data: profiles }] = await Promise.all([
    getUser(),
    getAllUserProfileWithLanguagesAndSlots(),
  ]);

  return <CommunityClient currentUser={currentUser} profiles={profiles || []} />;
}
