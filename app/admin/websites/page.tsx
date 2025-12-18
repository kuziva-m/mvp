import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { query } from "@/lib/db";
import { GenerateButton } from "./generate-button"; // ✅ Import the new button

export const dynamic = "force-dynamic";

export default async function WebsitesPage() {
  // Fetch existing websites
  const { data: websites } = await query("websites");
  const safeWebsites = websites || [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Website Generation
          </h1>
          <p className="text-muted-foreground">
            Manage AI-generated sites and QA reports.
          </p>
        </div>
        {/* ✅ Replaced static button with functional one */}
        <GenerateButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeWebsites.map((site: any) => (
          <Card key={site.id} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium capitalize">
                {site.subdomain?.replace(/-/g, " ") || "Untitled"}
              </CardTitle>
              <StatusBadge status={site.status} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Template:{" "}
                  <span className="font-medium text-foreground">
                    {site.template_id}
                  </span>
                </div>

                {site.status !== "draft" && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>QA Score:</span>
                    <span
                      className={`font-bold ${
                        site.qa_score > 80 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {site.qa_score}/100
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                  {site.status === "flagged" && (
                    <Button variant="destructive" size="sm" className="w-full">
                      Fix Issues
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {safeWebsites.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
            <p className="text-muted-foreground">
              No websites generated yet. <br />
              Click <b>"Bulk Generate"</b> to create sites for your existing
              leads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "generated")
    return (
      <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" /> Ready
      </Badge>
    );
  if (status === "flagged")
    return (
      <Badge
        variant="destructive"
        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
      >
        <AlertTriangle className="w-3 h-3 mr-1" /> QA Issues
      </Badge>
    );
  return <Badge variant="secondary">Processing</Badge>;
}
