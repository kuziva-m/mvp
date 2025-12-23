import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ArrowLeft, CreditCard } from "lucide-react";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();

  // Verify site exists
  const { data: site } = await supabase
    .from("sites")
    .select("*, leads(business_name)")
    .eq("id", siteId)
    .single();

  if (!site) notFound();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Claim Your Website</CardTitle>
          <CardDescription>
            Complete your setup for <strong>{site.leads?.business_name}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Website Design & Setup</span>
              <span className="font-semibold">$299.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Hosting & Domain (Monthly)</span>
              <span className="font-semibold">$29.00/mo</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
              <span>Total Due Today</span>
              <span>$328.00</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Ownership of this custom design",
              "We connect your domain name (com)",
              "Mobile responsive & SEO optimized",
              "24/7 Hosting included",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <Check className="w-4 h-4 text-green-500" /> {item}
              </div>
            ))}
          </div>

          {/* MOCK PAYMENT BUTTON */}
          <Link
            href={`mailto:your-email@agency.com?subject=I want to buy site ${siteId}`}
            className="block"
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
              Proceed to Payment
            </Button>
          </Link>

          <div className="text-center">
            <Link
              href={`/preview/${siteId}`}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft className="w-3 h-3 inline mr-1" /> Back to Preview
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
