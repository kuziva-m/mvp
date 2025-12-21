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
import { SearchInput } from "./search-input";

// Define the type for the business data
interface Business {
  id: string;
  business_name: string | null;
  email: string;
}

export default async function SelectBusinessPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createClient();
  const queryTerm = searchParams?.q || "";

  // Base query
  let query = supabase
    .from("users")
    .select("id, business_name, email")
    .order("business_name", { ascending: true })
    .limit(20); // Limit results for performance (Pagination can be added later)

  // Apply filter if search term exists
  if (queryTerm) {
    query = query.or(
      `business_name.ilike.%${queryTerm}%,email.ilike.%${queryTerm}%`
    );
  }

  const { data: businesses } = await query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="text-center shrink-0">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Select Business</CardTitle>
          <CardDescription>
            Search and manage your 5,000+ clients
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Client Side Search Component */}
          <SearchInput />

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {businesses?.map((business: Business) => (
              <form
                key={business.id}
                action={selectBusiness.bind(null, business.id)}
              >
                <Button
                  variant="outline"
                  className="w-full justify-between h-16 px-4 hover:border-primary hover:bg-primary/5 group transition-all"
                  type="submit"
                >
                  <div className="flex flex-col items-start text-left truncate w-full pr-4">
                    <span className="font-semibold truncate w-full">
                      {business.business_name || "Unnamed Business"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {business.email}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </form>
            ))}

            {(!businesses || businesses.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm space-y-2">
                <p>No businesses found.</p>
                {queryTerm && <p>Try a different search term.</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
