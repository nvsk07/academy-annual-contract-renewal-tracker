import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <Lock className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Link href="/">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}