"use client";

// 1. Change import from 'react-dom' to 'react' and rename to useActionState
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateBusinessProfile, State } from "./actions";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData: {
    business_name: string | null;
    email: string;
  };
}

const initialState: State = {
  status: "idle",
  message: null,
};

export function ProfileForm({ initialData }: ProfileFormProps) {
  // 2. Update Hook Usage: returns [state, action, isPending]
  const [state, formAction, isPending] = useActionState(
    updateBusinessProfile,
    initialState
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            This is how your business appears on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              defaultValue={initialData.business_name || ""}
              placeholder="Acme Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              defaultValue={initialData.email || ""}
              placeholder="admin@acme.com"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {/* 3. Use isPending for better UX */}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
