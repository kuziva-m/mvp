"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 1. Define a standard return type
export interface AuthResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const businessName = formData.get("businessName") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If user is created but no session exists, it means "Confirm Email" is on.
  if (data?.user && !data?.session) {
    return {
      success: true,
      message:
        "Account created! Please check your email to confirm your account before logging in.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}
