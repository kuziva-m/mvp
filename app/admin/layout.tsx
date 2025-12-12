import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold">MVP Web Agency</span>
              </Link>

              <div className="ml-10 flex items-center space-x-4">
                <Link href="/admin/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="ghost">Analytics</Button>
                </Link>
                <Link href="/admin/lead-gen">
                  <Button variant="ghost">Lead Gen</Button>
                </Link>
                <Link href="/admin/leads">
                  <Button variant="ghost">Leads</Button>
                </Link>
                <Link href="/admin/qa">
                  <Button variant="ghost">QA</Button>
                </Link>
                <Link href="/admin/workers">
                  <Button variant="ghost">Workers</Button>
                </Link>
                <Link href="/admin/support">
                  <Button variant="ghost">Support</Button>
                </Link>
                <Link href="/admin/websites">
                  <Button variant="ghost">Websites</Button>
                </Link>
                <Link href="/admin/emails">
                  <Button variant="ghost">Emails</Button>
                </Link>
                <Link href="/admin/financials">
                  <Button variant="ghost">Financials</Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <Button variant="outline" size="sm">Settings</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
