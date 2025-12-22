import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function WebsitesPage() {
  const supabase = await createClient();

  const { data: sites, error } = await supabase
    .from("sites")
    .select(
      `
      *,
      leads (
        business_name,
        industry,
        email
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading sites: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Generated Websites
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your inventory of AI-generated demos.
          </p>
        </div>
      </div>

      {!sites || sites.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              No Websites Yet
            </h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Go to the Leads tab, pick a business, and click "Generate Website"
              to start your factory.
            </p>
            <Link href="/admin/leads">
              <Button className="mt-6" variant="outline">
                Go to Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site: any) => {
            const content = site.content_data || site.content || {};
            const heroHeadline =
              content.hero?.headline || content.heroHeadline || "No Headline";

            return (
              <Card
                key={site.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header with Status */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start w-full gap-3">
                    {/* TEXT CONTAINER: Allow wrapping */}
                    <div className="min-w-0 flex-1">
                      <CardTitle
                        className="text-lg break-words pr-1"
                        title={site.leads?.business_name}
                      >
                        {site.leads?.business_name || "Unknown Business"}
                      </CardTitle>
                      <p
                        className="text-xs text-muted-foreground mt-1 truncate"
                        title={site.leads?.industry}
                      >
                        {site.leads?.industry}
                      </p>
                    </div>

                    {/* BADGE: Prevent wrapping and cutting off */}
                    <Badge
                      variant={site.is_published ? "default" : "secondary"}
                      className="shrink-0 whitespace-nowrap"
                    >
                      {site.style}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Preview of the AI Copy */}
                  <div className="p-3 bg-slate-50 rounded-md text-sm text-slate-600 h-24 overflow-hidden border">
                    <span className="font-semibold text-slate-900 block mb-1">
                      Hero:
                    </span>
                    "{heroHeadline}"
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/preview/${site.id}`}
                      className="w-full"
                      target="_blank"
                    >
                      <Button className="w-full gap-2" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                        Preview Site
                      </Button>
                    </Link>
                  </div>

                  <div className="text-xs text-center text-slate-400">
                    Generated {formatDistanceToNow(new Date(site.created_at))}{" "}
                    ago
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
