"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function selectBusiness(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set("mock_user_id", userId, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect("/admin/dashboard");
}

export async function logoutBusiness() {
  const cookieStore = await cookies();
  cookieStore.delete("mock_user_id");
  redirect("/select-business");
}
