import ResetPasswordClient from "./ResetPasswordClient";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ResetPasswordPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";

  return <ResetPasswordClient email={email} />;
}
