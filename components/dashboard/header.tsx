"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  UserCheck,
  Shield,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { RoleBadge } from "./role-badge";
import { DEMO_USERS, DEMO_SCHOOL } from "@/lib/data/demo-data";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
    schoolName: string;
    avatarUrl?: string | null;
  };
  onOpenSidebar: () => void;
}

export function Header({ user, onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleRoleSwitch = async (role: string, email?: string) => {
    setIsSwitching(true);
    setShowRoleMenu(false);
    try {
      const res = await fetch("/api/auth/switch-demo-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 lg:px-8 backdrop-blur shadow-xs">
      {/* Left: Mobile trigger & School context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{DEMO_SCHOOL.name}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {DEMO_SCHOOL.currentTerm}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Nairobi Campus • {DEMO_SCHOOL.curriculum}
          </span>
        </div>
      </div>

      {/* Right: Quick Role Switcher, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Role Switcher (Crucial for testing all user roles in Phase 1) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={isSwitching}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden md:inline text-slate-500">Active Role:</span>
            <RoleBadge role={user.role} />
            {isSwitching ? (
              <RefreshCw className="h-3 w-3 animate-spin text-slate-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-slate-400" />
            )}
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="px-2.5 py-1.5 border-b border-slate-100 font-semibold text-slate-800 flex items-center justify-between">
                <span>Switch Demo Role (Phase 1)</span>
                <span className="text-[10px] text-emerald-600 font-mono">1-Click</span>
              </div>
              <div className="py-1 space-y-0.5">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleRoleSwitch(demo.role, demo.email)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      user.email === demo.email
                        ? "bg-emerald-50 font-semibold text-emerald-900 border border-emerald-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs">{demo.name}</div>
                      <div className="text-[10px] text-slate-400">{demo.title}</div>
                    </div>
                    <RoleBadge role={demo.role} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Notifications Bell */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="3 unread intelligence notices"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Avatar
              src={user.avatarUrl}
              fallback={user.name}
              size="sm"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="p-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{user.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                <div className="mt-1.5">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
