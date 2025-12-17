import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get current user data securely
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile data from public table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              defaultValue={user?.email}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed securely via this form yet.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              defaultValue={profile?.business_name || ""}
              placeholder="My Awesome Agency"
            />
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="stripe-key">Stripe Public Key</Label>
            <Input
              id="stripe-key"
              type="password"
              value="pk_test_************************"
              disabled
            />
          </div>
          <Button variant="outline">Regenerate Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
}
