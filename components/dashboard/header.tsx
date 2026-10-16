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
  RefreshCw,
  GraduationCap,
  Globe,
  Mail,
} from "lucide-react";
import { RoleBadge } from "./role-badge";
import { DEMO_USERS } from "@/lib/data/demo-data";
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

  const roleDisplayLabel =
    user.role === "PARENT"
      ? "Parent"
      : user.role === "SUPER_ADMIN"
      ? "Super Admin"
      : user.role === "PRINCIPAL"
      ? "Principal"
      : user.role === "TEACHER"
      ? "Teacher"
      : user.role === "STUDENT"
      ? "Student"
      : user.role === "FINANCE_OFFICER"
      ? "Finance"
      : "Staff";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white px-4 lg:px-8 shadow-2xs">
      {/* Left: Mobile trigger & System Welcome Message */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Welcome To SOP School Management System (SOP is a system, not a school) */}
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">
              Welcome To SOP
            </span>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">
              School Management System
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Here ..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-full pl-4 pr-9 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#ffbc00] transition-colors"
          />
          <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Right Controls: Language, Messages, Notifications, Role Switcher, User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Language selector */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
          <Globe className="h-3.5 w-3.5 text-slate-400" />
          <span>English</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>

        {/* Message Icon with badge counter 5 */}
        <button
          type="button"
          title="5 new messages"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
        >
          <Mail className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1890ff] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            5
          </span>
        </button>

        {/* Notification Bell with badge counter 8 */}
        <button
          type="button"
          title="8 system notices"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#ff4d4f] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            8
          </span>
        </button>

        {/* Demo Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={isSwitching}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition-colors"
          >
            <UserCheck className="h-3 w-3 text-amber-500" />
            <span className="text-slate-400">Role:</span>
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
                <span>Switch System Persona</span>
                <span className="text-[10px] text-amber-600 font-mono">1-Click</span>
              </div>
              <div className="py-1 space-y-0.5">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleRoleSwitch(demo.role, demo.email)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      user.email === demo.email
                        ? "bg-amber-50 font-semibold text-amber-900 border border-amber-200"
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

        {/* User Profile Block */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#f39c12] text-white flex items-center justify-center font-bold text-xs ring-2 ring-amber-100 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {roleDisplayLabel}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:inline" />
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
