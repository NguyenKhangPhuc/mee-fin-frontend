import VerifyClient from "./VerifyClient";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";

  return <VerifyClient email={email} />;
}
