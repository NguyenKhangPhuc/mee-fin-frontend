import { getUserProfile } from "../services/profile/get-user-profile";
import { getAllLanguages } from "../services/language/get-language";
import { getAllUserLanguages } from "../services/user-language/get-user-language";
import { getAllUserSlots } from "../services/slots/get-user-slots";
import UserDashboardClient from "./UserDashboardClient";

export default async function DashboardPage() {
  const { data: profile } = await getUserProfile();

  const [{ data: allLanguages }, { data: userLanguages }, { data: userSlots }] = await Promise.all([
    getAllLanguages(),
    profile?.id ? getAllUserLanguages(profile.id) : Promise.resolve({ data: [], error: null }),
    profile?.id ? getAllUserSlots(profile.id) : Promise.resolve({ data: [], error: null }),
  ]);

  return (
    <UserDashboardClient
      profile={profile}
      allLanguages={allLanguages || []}
      userLanguages={userLanguages || []}
      userSlots={userSlots || []}
    />
  );
}
