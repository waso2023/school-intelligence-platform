import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataImportClient } from "@/components/settings/data-import-client";

export const metadata = {
  title: "Data Migration & Import Center | Super Admin",
  description: "Institutional spreadsheet import and migration center restricted to Super Administrators.",
};

export default async function DataImportPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Strict Super Admin Access Gate
  if (session.role !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-white border border-rose-200 shadow-sm text-center space-y-5 animate-in fade-in duration-200">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 shadow-xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Lock className="h-3 w-3" />
            Restricted System Area
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Super Administrator Privileges Required
          </h1>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            The Institutional Data Migration &amp; Import Center performs direct bulk persistence of student entities,
            cross-tenant validation, and batch database rollbacks. This utility is strictly restricted to authorized
            <strong> Super Administrators</strong>.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            Current Session: <span className="text-slate-700 font-semibold">{session.name}</span> ({session.role})
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="emerald" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>Back to Settings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <DataImportClient />;
}
