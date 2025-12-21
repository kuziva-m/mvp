"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type State = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function updateBusinessProfile(
  prevState: State,
  formData: FormData
): Promise<State> {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;

  if (!mockUserId) {
    return { status: "error", message: "Not authenticated" };
  }

  const businessName = formData.get("businessName") as string;
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({
      business_name: businessName,
      email: email,
    })
    .eq("id", mockUserId);

  if (error) {
    return { status: "error", message: error.message };
  }

  // Refresh data on screen
  revalidatePath("/admin", "layout");

  return { status: "success", message: "Profile updated successfully" };
}
