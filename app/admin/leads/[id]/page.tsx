import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  MailOpen,
  MousePointerClick,
  Reply,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getById, query } from "@/lib/db";
import type { Lead, Site, EmailLog } from "@/types";
import { GenerateWebsiteButton } from "@/components/GenerateWebsiteButton";
import SendEmailButton from "@/components/SendEmailButton";
import { deleteLead } from "../actions"; // Import the delete action

export const dynamic = "force-dynamic";

// Extended type to handle optional fields and type mismatches
type ExtendedLead = Omit<Lead, "quality_score"> & {
  updated_at?: string;
  automation_paused?: string;
  email_sent_at?: string;
  email_opened_at?: string;
  email_clicked_at?: string;
  email_replied_at?: string;
  quality_score?: number | null;
};

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Component for the Delete Button Form
function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deleteLead(id);
        redirect("/admin/leads");
      }}
    >
      <Button variant="destructive" size="sm" className="gap-2">
        <Trash2 className="h-4 w-4" />
        Delete Lead
      </Button>
    </form>
  );
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const { data: rawLead, error } = await getById<Lead>("leads", id);

  if (error || !rawLead) {
    notFound();
  }

  // Cast to ExtendedLead to handle optional fields safely
  const lead = rawLead as unknown as ExtendedLead;

  // Check if site already exists
  const { data: sites } = await query<Site>("sites", { lead_id: id });
  const existingSite = sites && sites.length > 0 ? sites[0] : null;

  // Get email logs
  const { data: emailLogs } = await query<EmailLog>("email_logs", {
    lead_id: id,
  });
  const sortedEmailLogs =
    emailLogs?.sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    ) || [];

  const STATUS_COLORS = {
    pending: "bg-gray-100 text-gray-800",
    scraped: "bg-blue-100 text-blue-800",
    generated: "bg-purple-100 text-purple-800",
    emailed: "bg-yellow-100 text-yellow-800",
    opened: "bg-orange-100 text-orange-800",
    clicked: "bg-cyan-100 text-cyan-800",
    subscribed: "bg-green-100 text-green-800",
    delivered: "bg-emerald-100 text-emerald-800",
    canceled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Button>
          </Link>
        </div>

        {/* DELETE BUTTON ADDED HERE */}
        <DeleteButton id={lead.id} />
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Lead Details</h1>
        <p className="text-gray-600 mt-2">View and manage lead information</p>
      </div>

      {/* Lead Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{lead.business_name}</CardTitle>
              <CardDescription>
                Created {format(new Date(lead.created_at), "MMMM d, yyyy")}
              </CardDescription>
            </div>
            <Badge
              className={
                STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] ||
                STATUS_COLORS.pending
              }
            >
              {lead.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {lead.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium capitalize">{lead.industry}</p>
              </div>
            </div>
          </div>

          {/* Lead Metadata */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Lead Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Score</p>
                <p className="font-medium">
                  {lead.quality_score !== null &&
                  lead.quality_score !== undefined ? (
                    <span>{lead.quality_score}/100</span>
                  ) : (
                    <span className="text-gray-400">Not scored</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-medium">
                  {lead.updated_at ? (
                    format(new Date(lead.updated_at), "MMM d, yyyy h:mm a")
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Email Activity */}
          {(lead.email_sent_at ||
            lead.email_opened_at ||
            lead.email_clicked_at ||
            lead.email_replied_at) && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Email Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                {lead.email_sent_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Sent</p>
                    <p className="font-medium">
                      {format(
                        new Date(lead.email_sent_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                )}
                {lead.email_opened_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Opened</p>
                    <p className="font-medium">
                      {format(
                        new Date(lead.email_opened_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                )}
                {lead.email_clicked_at && (
                  <div>
                    <p className="text-sm text-gray-500">Link Clicked</p>
                    <p className="font-medium">
                      {format(
                        new Date(lead.email_clicked_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                )}
                {lead.email_replied_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Replied</p>
                    <p className="font-medium">
                      {format(
                        new Date(lead.email_replied_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Automation Status */}
          {lead.automation_paused && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Automation</h3>
              <div>
                <p className="text-sm text-gray-500">Paused At</p>
                <p className="font-medium text-yellow-600">
                  {format(
                    new Date(lead.automation_paused),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Website Generation</CardTitle>
          <CardDescription>
            Generate an AI-powered website for this lead
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingSite ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">
                    Website Generated
                  </p>
                  <p className="text-sm text-green-700">
                    Template:{" "}
                    <span className="capitalize">{existingSite.style}</span>
                  </p>
                </div>
                <Link href={existingSite.preview_url || "#"}>
                  <Button>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Preview
                  </Button>
                </Link>
              </div>
              <GenerateWebsiteButton leadId={id} currentStatus={lead.status} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                No website has been generated yet. Click the button below to
                generate a custom website using AI.
              </p>
              <GenerateWebsiteButton leadId={id} currentStatus={lead.status} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Communication Card */}
      <Card>
        <CardHeader>
          <CardTitle>Email Communication</CardTitle>
          <CardDescription>Send emails and track engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Status Grid */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Email Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sent Status */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  lead.email_sent_at
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mail
                    className={`h-5 w-5 ${
                      lead.email_sent_at ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      lead.email_sent_at ? "text-blue-900" : "text-gray-600"
                    }`}
                  >
                    Sent
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {lead.email_sent_at
                    ? format(new Date(lead.email_sent_at), "MMM d, h:mm a")
                    : "Not sent"}
                </p>
              </div>

              {/* Opened Status */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  lead.email_opened_at
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MailOpen
                    className={`h-5 w-5 ${
                      lead.email_opened_at ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      lead.email_opened_at ? "text-green-900" : "text-gray-600"
                    }`}
                  >
                    Opened
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {lead.email_opened_at
                    ? format(new Date(lead.email_opened_at), "MMM d, h:mm a")
                    : "Not opened"}
                </p>
              </div>

              {/* Clicked Status */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  lead.email_clicked_at
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick
                    className={`h-5 w-5 ${
                      lead.email_clicked_at
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      lead.email_clicked_at
                        ? "text-emerald-900"
                        : "text-gray-600"
                    }`}
                  >
                    Clicked
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {lead.email_clicked_at
                    ? format(new Date(lead.email_clicked_at), "MMM d, h:mm a")
                    : "No clicks"}
                </p>
              </div>

              {/* Replied Status */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  lead.email_replied_at
                    ? "bg-purple-50 border-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Reply
                    className={`h-5 w-5 ${
                      lead.email_replied_at
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      lead.email_replied_at
                        ? "text-purple-900"
                        : "text-gray-600"
                    }`}
                  >
                    Replied
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {lead.email_replied_at
                    ? format(new Date(lead.email_replied_at), "MMM d, h:mm a")
                    : "No reply"}
                </p>
              </div>
            </div>
          </div>

          {/* Email History Logs */}
          {sortedEmailLogs.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Email History</h3>
              <div className="space-y-3">
                {sortedEmailLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{log.subject}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Sent{" "}
                          {format(new Date(log.sent_at), "MMM d, yyyy h:mm a")}
                        </p>
                        <div className="flex gap-4 mt-2">
                          {log.opened_at && (
                            <span className="text-xs text-green-600">
                              ✓ Opened{" "}
                              {format(new Date(log.opened_at), "MMM d, h:mm a")}
                            </span>
                          )}
                          {log.clicked_at && (
                            <span className="text-xs text-emerald-600">
                              ✓ Clicked{" "}
                              {format(
                                new Date(log.clicked_at),
                                "MMM d, h:mm a"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      {log.resend_message_id && (
                        <span className="text-xs text-gray-500 font-mono">
                          {log.resend_message_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Email Button Section */}
          <div>
            <SendEmailButton
              leadId={id}
              disabled={!existingSite || !lead.email}
            />
            {!existingSite && (
              <p className="text-sm text-gray-500 mt-2">
                Generate a website first before sending emails
              </p>
            )}
            {!lead.email && (
              <p className="text-sm text-red-500 mt-2">
                Lead has no email address
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
