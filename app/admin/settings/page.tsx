import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;

  if (!mockUserId) return <div>Not authenticated</div>;

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", mockUserId)
    .single();

  if (!user) return <div>User not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your business profile and preferences.
        </p>
      </div>

      <ProfileForm initialData={user} />
    </div>
  );
}
