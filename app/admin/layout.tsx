import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import { TopNav } from "@/components/admin/top-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Check for the mock session cookie
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;

  if (!mockUserId) {
    redirect("/select-business");
  }

  // 2. Fetch the selected business details
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", mockUserId)
    .single();

  // 3. Safety check: if cookie exists but user doesn't, force re-selection
  if (!user) {
    redirect("/select-business");
  }

  // 4. Render Layout
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <Sidebar businessName={user.business_name || user.email} />
      <div className="flex-1 flex flex-col pl-64">
        <TopNav user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
