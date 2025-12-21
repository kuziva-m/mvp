import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function QAPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;
  const supabase = await createClient();

  // Fetch sites with QA status
  const { data: sites } = await supabase
    .from("sites")
    .select("*, leads!inner(business_name)")
    .eq("leads.user_id", mockUserId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">QA Reviews</h2>

      <div className="grid gap-4">
        {sites?.map((site) => (
          <Card key={site.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-lg">
                  {/* @ts-ignore */}
                  {site.leads?.business_name || "Unknown Business"}
                </span>
                <a
                  href={site.preview_url}
                  target="_blank"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {site.preview_url || "No Preview URL"}
                </a>
              </div>

              <div className="flex items-center gap-4">
                {site.qa_status === "passed" ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Passed
                  </Badge>
                ) : site.qa_status === "failed" ? (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" /> Failed
                  </Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
                <div className="font-mono text-sm text-muted-foreground">
                  Score: {site.qa_score || 0}/100
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!sites || sites.length === 0) && (
          <div className="text-center text-muted-foreground p-10">
            No sites in QA queue.
          </div>
        )}
      </div>
    </div>
  );
}
