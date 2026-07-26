import { getAllUserProfileWithLanguagesAndSlots } from "../services/profile/get-all-user";
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  const { data: profiles } = await getAllUserProfileWithLanguagesAndSlots();

  return <CommunityClient profiles={profiles || []} />;
}
