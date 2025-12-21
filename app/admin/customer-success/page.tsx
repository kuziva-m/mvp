import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CustomerSuccessPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;
  const supabase = await createClient();

  // Fetch 'Customer Health' - Assuming we aggregate from leads status
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", mockUserId)
    .neq("status", "new"); // Only active/engaged leads

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Customer Success</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Simple Health Logic based on your requirements */}
        {leads?.map((lead) => (
          <Card key={lead.id}>
            <CardHeader>
              <CardTitle>{lead.business_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{lead.status}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Health:</span>
                <span className="text-green-600 font-bold">Good</span>{" "}
                {/* Placeholder logic */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
