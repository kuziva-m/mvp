"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Loader2,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  Eye,
  MousePointerClick,
  CheckCircle2,
} from "lucide-react";
import { createLead, scrapeWebsite, updateLeadStatus } from "./actions";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { Lead } from "@/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch leads on load
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setLeads(data as Lead[]);
    setIsLoading(false);
  }

  // Handle the "Scrape" button
  async function handleScrape(url: string) {
    if (!url) return toast.error("Please enter a website URL");
    setIsScraping(true);
    const result = await scrapeWebsite(url);
    if (result.success) {
      setScrapedData(result.data);
      toast.success("Website analyzed successfully!");
    }
    setIsScraping(false);
  }

  // Handle saving the lead
  async function handleSave(formData: FormData) {
    const res = await createLead(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Lead added successfully");
      setIsDialogOpen(false);
      setScrapedData(null); // Reset form
      fetchLeads();
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    // Optimistic Update
    const originalLeads = [...leads];
    setLeads(
      leads.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
    );

    const result = await updateLeadStatus(id, newStatus);

    if (result?.error) {
      toast.error("Failed to update status");
      setLeads(originalLeads); // Revert
    } else {
      if (newStatus === "subscriber") {
        toast.success("Lead moved to Subscriptions!");
      } else {
        toast.success("Status updated");
      }
      // Re-fetch to get any server-side changes (like new subscription links)
      fetchLeads();
    }
  }

  // Filter leads for tabs
  const newLeads = leads.filter((l) => l.status === "new");
  const warmLeads = leads.filter((l) =>
    ["contacted", "warm"].includes(l.status)
  );
  const hotLeads = leads.filter((l) => l.status === "hot");

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">
            Track, analyze, and convert your prospects.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-blue-500/20">
              <Plus className="h-4 w-4" /> Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <CardDescription>
                Enter a website to auto-fill details.
              </CardDescription>
            </DialogHeader>

            <form action={handleSave} className="space-y-4 mt-4">
              <div className="flex gap-2">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    name="website"
                    placeholder="example.com"
                    onBlur={(e) => {
                      if (e.target.value.length > 3)
                        handleScrape(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isScraping}
                    onClick={() => {
                      const input = document.getElementById(
                        "url"
                      ) as HTMLInputElement;
                      handleScrape(input.value);
                    }}
                  >
                    {isScraping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Auto-filled Section */}
              <div
                className={`space-y-4 p-4 rounded-lg border bg-slate-50 transition-all ${
                  scrapedData ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  {scrapedData?.logo_url && (
                    <div className="col-span-1">
                      <img
                        src={scrapedData.logo_url}
                        alt="Logo"
                        className="w-12 h-12 rounded-lg bg-white object-contain border"
                      />
                      <input
                        type="hidden"
                        name="logoUrl"
                        value={scrapedData.logo_url}
                      />
                    </div>
                  )}
                  <div className="col-span-3">
                    <Label>Business Name</Label>
                    <Input
                      name="businessName"
                      defaultValue={scrapedData?.business_name}
                      required
                      placeholder="Business Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Industry</Label>
                    <Input
                      name="industry"
                      defaultValue={scrapedData?.industry}
                      placeholder="Tech, Retail..."
                    />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select name="source" defaultValue="Manual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual Entry</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="ScrapeMaps">ScrapeMaps</SelectItem>
                        <SelectItem value="FB Ads">FB Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      defaultValue={scrapedData?.email}
                      placeholder="contact@..."
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      defaultValue={scrapedData?.phone}
                      placeholder="+1..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isScraping}>
                  Save Lead
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABS SECTION */}
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="new">New ({newLeads.length})</TabsTrigger>
          <TabsTrigger value="warm">Warm ({warmLeads.length})</TabsTrigger>
          <TabsTrigger value="hot">Hot ({hotLeads.length})</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {["new", "warm", "hot"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader className="px-6 py-4 border-b bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">
                      {tab} Leads
                    </CardTitle>
                    <div className="flex gap-2">
                      {/* Add Filters Here later */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[280px]">Business</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === "new"
                        ? newLeads
                        : tab === "warm"
                        ? warmLeads
                        : hotLeads
                      ).map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                                {lead.logo_url ? (
                                  <img
                                    src={lead.logo_url}
                                    className="h-full w-full object-contain"
                                    alt=""
                                  />
                                ) : (
                                  <Globe className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {lead.business_name}
                                </div>
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                  {lead.website}{" "}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" /> {lead.email || "-"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />{" "}
                                {lead.phone || "-"}
                              </div>
                            </div>
                          </TableCell>

                          {/* NEW: Engagement Columns */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className="flex items-center gap-1"
                                title={
                                  lead.email_opened_at
                                    ? "Email Opened"
                                    : "Not Opened"
                                }
                              >
                                <Eye
                                  className={`h-4 w-4 ${
                                    lead.email_opened_at
                                      ? "text-green-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              </div>
                              <div
                                className="flex items-center gap-1"
                                title={
                                  lead.email_clicked_at
                                    ? "Link Clicked"
                                    : "Not Clicked"
                                }
                              >
                                <MousePointerClick
                                  className={`h-4 w-4 ${
                                    lead.email_clicked_at
                                      ? "text-blue-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              </div>
                              {lead.email_replied_at && (
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-700 hover:bg-orange-100"
                                >
                                  Replied
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="bg-slate-100">
                              {lead.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={lead.status}
                              onValueChange={(val) =>
                                handleStatusChange(lead.id, val)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="warm">Warm</SelectItem>
                                <SelectItem value="hot">Hot</SelectItem>
                                <SelectItem
                                  value="subscriber"
                                  className="text-green-600 font-medium focus:text-green-700"
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />{" "}
                                    Subscriber
                                  </div>
                                </SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(tab === "new"
                        ? newLeads
                        : tab === "warm"
                        ? warmLeads
                        : hotLeads
                      ).length === 0 &&
                        !isLoading && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-gray-500"
                            >
                              No leads found in {tab}.
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
