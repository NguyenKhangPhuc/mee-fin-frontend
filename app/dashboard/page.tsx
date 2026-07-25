import getUser from "../services/auth/user";
import UserDashboardClient from "./UserDashboardClient";

export default async function DashboardPage() {
  const { data: user } = await getUser();
  return <UserDashboardClient user={user} />;
}
