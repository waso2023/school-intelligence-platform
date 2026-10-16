"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS, DEMO_SCHOOL } from "@/lib/data/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  School,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@sopacademy.ac.ke");
  const [password, setPassword] = useState("Admin@2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setErrorMessage("Network error occurred. Please check your connection.");
      setIsLoading(false);
    }
  };

  const selectDemoUser = async (user: typeof DEMO_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setErrorMessage("Network error occurred. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Left side: Premium Academy Brand Showcase */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-[#ffbc00] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              SOP
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                SOP Management System
              </span>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Enterprise School Intelligence Platform
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Enterprise Educational Operations & Intelligence System • Nairobi, Kenya
          </p>
        </div>

        <div className="my-10 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Production-Ready Multi-Tenant School SaaS
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen School Intelligence & Operations for Kenya
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Unifying student academics, automated fee billing & M-Pesa reconciliations, parent communications, and executive RAG-driven AI intelligence into one secure, tenant-isolated system.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-emerald-400 font-bold text-base">312+</div>
              <div className="text-slate-400">Enrolled Students</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-emerald-400 font-bold text-base">94.6%</div>
              <div className="text-slate-400">Attendance Monitored</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-emerald-400 font-bold text-base">KSh 19.5M</div>
              <div className="text-slate-400">Fees Collected (Term 1)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <div className="text-emerald-400 font-bold text-base">AI Driven</div>
              <div className="text-slate-400">Automated Risk Alerts</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Kenya Data Protection Act (2019) Compliant</span>
          </div>
          <span>Tenant: SOP-001</span>
        </div>
      </div>

      {/* Right side: Login & Demo Account Selection */}
      <div className="lg:w-1/2 p-6 lg:p-14 flex flex-col justify-center bg-slate-950">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Portal Sign In
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select your role or enter your institutional credentials to continue.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Institutional Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sopacademy.ac.ke"
                required
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  Password
                </label>
                <span className="text-xs text-emerald-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              variant="emerald"
              className="w-full h-11 text-sm font-semibold mt-2 shadow-lg shadow-emerald-600/30"
              isLoading={isLoading}
            >
              Access Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                1-Click Demo Accounts (Phase 1)
              </span>
              <span className="text-[10px] text-slate-400">Click to fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectDemoUser(user)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    email === user.email
                      ? "bg-emerald-950/60 border-emerald-500/80 text-white ring-1 ring-emerald-500/50"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate text-[11px]">{user.name}</span>
                    <Badge variant={email === user.email ? "success" : "secondary"} className="text-[9px] py-0 px-1">
                      {user.role.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {user.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
