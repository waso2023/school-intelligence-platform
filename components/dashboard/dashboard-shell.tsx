"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SessionPayload } from "@/lib/auth/jwt";

interface DashboardShellProps {
  session: SessionPayload;
  children: React.ReactNode;
}

export function DashboardShell({ session, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Permission-aware) */}
      <Sidebar
        userPermissions={session.permissions}
        userRole={session.role}
        userEmail={session.email}
        userName={session.name}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header
          user={session}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
