"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Database, Globe } from "lucide-react";
import { toast } from "sonner";

interface LeadGenClientProps {
  initialLeads: any[];
  totalCount: number;
}

export function LeadGenClient({
  initialLeads,
  totalCount,
}: LeadGenClientProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyword, setKeyword] = useState("");

  async function handleGenerate() {
    if (!keyword) {
      toast.error("Please enter a keyword");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-test-leads", {
        method: "POST",
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error("Generation failed");
      toast.success("Lead generation started!");
      // Ideally trigger a refresh here, e.g., router.refresh()
    } catch (error) {
      toast.error("Failed to start generation.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>New Search</CardTitle>
          <CardDescription>
            Enter an industry or keyword to find new leads
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="e.g. Plumbers in New York"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Leads
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Recent Leads ({totalCount})</h2>
        {initialLeads.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed rounded-xl bg-muted/50">
            <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Start a search above to populate your database.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {initialLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-bold truncate">
                    {lead.business_name || "Unknown"}
                  </CardTitle>
                  <Badge variant={lead.email ? "default" : "secondary"}>
                    {lead.email ? "Email" : "No Email"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  {lead.website && (
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Globe className="w-3 h-3 mr-1" />
                      {lead.website}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Added: {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
