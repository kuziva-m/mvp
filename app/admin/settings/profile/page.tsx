import { redirect } from "next/navigation";

export default function ProfilePage() {
  // For this MVP, Profile and Settings are the same page
  redirect("/admin/settings");
}
