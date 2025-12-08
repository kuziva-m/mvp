import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { testConnection } from "@/lib/db";

export default async function Home() {
  // Test database connection on page load
  const dbConnected = await testConnection()

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">MVP Web Agency</h1>
          <p className="text-xl text-gray-600">Automated Website SaaS Platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Manage leads, websites, emails, and customers
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href="/admin">Go to Admin</Link>
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Check system health and metrics
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className={`text-sm font-medium ${dbConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {dbConnected ? 'Connected ✓' : 'Disconnected ✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next.js</span>
                  <span className="text-sm font-medium text-green-600">Running ✓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Environment</span>
                  <span className="text-sm font-medium text-blue-600">Development</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Next.js 15 • TypeScript • Tailwind CSS • shadcn/ui • Supabase</p>
        </div>
      </div>
    </main>
  );
}
