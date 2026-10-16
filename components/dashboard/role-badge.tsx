import { Badge } from "@/components/ui/badge";

const ROLE_COLORS: Record<string, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  SCHOOL_ADMIN: {
    label: "School Admin",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PRINCIPAL: {
    label: "Principal",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  TEACHER: {
    label: "Teacher",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  FINANCE_OFFICER: {
    label: "Finance Officer",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  RECEPTIONIST: {
    label: "Receptionist",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  PARENT: {
    label: "Parent",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  STUDENT: {
    label: "Student",
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  DRIVER: {
    label: "Driver",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

export function RoleBadge({ role }: { role: string }) {
  const config = ROLE_COLORS[role] || {
    label: role,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
