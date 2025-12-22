"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // If you don't have sonner, delete this line

interface GenerateWebsiteButtonProps {
  leadId: string;
  currentStatus: string;
}

export function GenerateWebsiteButton({
  leadId,
  currentStatus,
}: GenerateWebsiteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      console.log("--> CLICKED GENERATE for Lead:", leadId);

      // 1. Call the API
      const response = await fetch(`/api/leads/${leadId}/generate`, {
        method: "POST",
      });

      console.log("--> API RESPONSE STATUS:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate website");
      }

      const data = await response.json();
      console.log("--> GENERATION SUCCESS:", data);

      // 2. Success Feedback
      // toast.success("Website generated successfully!"); // Uncomment if using sonner
      alert("Website Generated! Check your terminal for AI logs.");

      // 3. Refresh the page to show the new status/link
      router.refresh();
    } catch (error: any) {
      console.error("--> GENERATION ERROR:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Website
        </>
      )}
    </Button>
  );
}
