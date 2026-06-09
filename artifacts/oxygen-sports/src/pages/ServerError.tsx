import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ServerCrash } from "lucide-react";

export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-slate-100 p-6 rounded-full mb-6">
        <ServerCrash className="h-12 w-12 text-slate-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Something went wrong</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        Our team has been notified. Please try again.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}