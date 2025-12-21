import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";
import { selectBusiness } from "@/app/actions/auth-mock";

// Define the type for the business data
interface Business {
  id: string;
  business_name: string | null;
  email: string;
}

export default async function SelectBusinessPage() {
  // Await the client creation as required in Next.js 15+
  const supabase = await createClient();

  const { data: businesses } = await supabase
    .from("users")
    .select("*")
    .order("business_name");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Select Business</CardTitle>
          <CardDescription>
            Choose a business profile to manage the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {businesses?.map((business: Business) => (
              <form
                key={business.id}
                action={selectBusiness.bind(null, business.id)}
              >
                <Button
                  variant="outline"
                  className="w-full justify-between h-14 hover:border-primary hover:bg-primary/5 group"
                  type="submit"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">
                      {business.business_name || "Unnamed Business"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {business.email}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </form>
            ))}

            {(!businesses || businesses.length === 0) && (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No businesses found. Please run the seed script.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
