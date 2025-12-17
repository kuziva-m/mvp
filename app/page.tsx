import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testConnection } from "@/lib/db";
import {
  ArrowRight,
  Database,
  LayoutTemplate,
  Server,
  ShieldCheck,
} from "lucide-react";

export default async function Home() {
  // Test database connection on page load
  const dbConnected = await testConnection();

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 opacity-50" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full border-blue-100 bg-blue-50 text-blue-700"
          >
            v1.0.0 Public Beta
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            MVP Web Agency
            <span className="block text-primary mt-2">Operating System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The automated SaaS platform for managing leads, generating websites,
            and handling customer subscriptions at scale.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-base shadow-lg shadow-blue-500/20"
            >
              <Link href="/admin">
                Enter Admin Console <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base bg-white"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard & Status Grid */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Access Card */}
          <Card className="shadow-xl border-0 ring-1 ring-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LayoutTemplate className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Mission Control</CardTitle>
              <CardDescription className="text-base mt-2">
                Manage your agency operations. Access the Kanban board,
                financial metrics, and lead generation tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/admin">Access Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className="shadow-xl border-0 ring-1 ring-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">System Health</CardTitle>
              <CardDescription className="text-base mt-2">
                Real-time operational status of infrastructure and database
                connectivity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Supabase
                    </span>
                  </div>
                  <Badge
                    variant={dbConnected ? "default" : "destructive"}
                    className={
                      dbConnected ? "bg-green-600 hover:bg-green-700" : ""
                    }
                  >
                    {dbConnected ? "Operational" : "Disconnected"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Environment
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {process.env.NODE_ENV === "development"
                      ? "Development"
                      : "Production"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Powered by Next.js 15 • TypeScript • Tailwind CSS • Shadcn UI
          </p>
        </div>
      </div>
    </main>
  );
}
