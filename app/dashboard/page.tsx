import { getAllLanguages } from "../services/language/get-language";
import { getUserProfileWithLanguagesAndSlotsById } from "../services/profile/get-user-profile-with-languages-and-slots";
import UserDashboardClient from "./UserDashboardClient";

export default async function DashboardPage() {
  const [{ data: allLanguages }, { data: profile }] = await Promise.all([
    getAllLanguages(),
    getUserProfileWithLanguagesAndSlotsById(),
  ]);

  return (
    <UserDashboardClient
      profile={profile}
      allLanguages={allLanguages || []}
    />
  );
}
