import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LandingView } from "@/modules/home/ui/views/landing-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/meetings");
  }

  return <LandingView />;
};

export default Page;
