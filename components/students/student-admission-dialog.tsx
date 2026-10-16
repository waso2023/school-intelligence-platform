"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentAdmissionSchema, StudentAdmissionInput } from "@/lib/validations/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_CLASSES } from "@/lib/data/demo-data";
import {
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  HeartPulse,
  Users,
  ShieldCheck,
} from "lucide-react";

interface StudentAdmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentAdmissionDialog({ isOpen, onClose, onSuccess }: StudentAdmissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentAdmissionInput>({
    resolver: zodResolver(StudentAdmissionSchema),
    defaultValues: {
      admissionNumber: `SOP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: "Male",
      status: "ACTIVE",
      className: "Grade 8",
      streamName: "East",
      curriculum: "CBC",
      admissionDate: new Date().toISOString().split("T")[0],
      county: "Nairobi",
      parentRelationship: "Father",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: StudentAdmissionInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        setErrorMessage(resData.error || "Failed to admit student");
        setIsSubmitting(false);
        return;
      }

      setSuccessNotice(`Student ${data.firstName} ${data.lastName} successfully enrolled under admission ${data.admissionNumber}!`);
      setTimeout(() => {
        reset();
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage("Network error occurred while submitting admission.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admit New Student</h2>
              <p className="text-xs text-slate-400">
                SOP International Academy • Academic Year 2026 Registration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successNotice}</span>
            </div>
          )}

          {/* Section 1: Student Demographics */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              1. Student Identity & Placement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Admission Number</label>
                <Input
                  {...register("admissionNumber")}
                  className="font-mono text-xs font-semibold"
                />
                {errors.admissionNumber && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.admissionNumber.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">First Name *</label>
                <Input {...register("firstName")} placeholder="e.g. Liam" />
                {errors.firstName && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Last Name *</label>
                <Input {...register("lastName")} placeholder="e.g. Ochieng" />
                {errors.lastName && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Date of Birth *</label>
                <Input type="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Gender *</label>
                <select
                  {...register("gender")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Class Placement *</label>
                <select
                  {...register("className")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {DEMO_CLASSES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Stream *</label>
                <select
                  {...register("streamName")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Curriculum Track *</label>
                <select
                  {...register("curriculum")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CBC">CBC (Competency Based Curriculum)</option>
                  <option value="Cambridge International">Cambridge International (IGCSE)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Admission Date</label>
                <Input type="date" {...register("admissionDate")} />
              </div>
            </div>
          </div>

          {/* Section 2: Parent / Guardian Details */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <Users className="h-4 w-4 text-emerald-600" />
              2. Parent & Guardian Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Parent Full Name *</label>
                <Input {...register("parentFullName")} placeholder="e.g. Catherine Ochieng" />
                {errors.parentFullName && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.parentFullName.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Relationship</label>
                <select
                  {...register("parentRelationship")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Parent Phone *</label>
                <Input {...register("parentPhone")} placeholder="+254 700 000 000" />
                {errors.parentPhone && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.parentPhone.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="font-medium text-slate-700 block mb-1">Parent Email *</label>
                <Input type="email" {...register("parentEmail")} placeholder="parent@example.com" />
                {errors.parentEmail && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.parentEmail.message}</p>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Residential Address *</label>
                <Input {...register("address")} placeholder="e.g. Karen Plains, Nairobi" />
                {errors.address && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Medical & Emergency Contact */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b pb-1">
              <HeartPulse className="h-4 w-4 text-emerald-600" />
              3. Medical & Emergency Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Blood Group</label>
                <Input {...register("bloodGroup")} placeholder="e.g. O+, A+" />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Known Allergies</label>
                <Input {...register("allergies")} placeholder="e.g. Peanuts, Penicillin" />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Emergency Phone *</label>
                <Input {...register("emergencyPhone")} placeholder="+254 722 000 000" />
                {errors.emergencyPhone && (
                  <p className="text-rose-600 text-[10px] mt-0.5">{errors.emergencyPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Multi-Tenant & KDPA 2019 Encrypted</span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="emerald"
                size="sm"
                isLoading={isSubmitting}
                className="shadow-md"
              >
                Complete Admission
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
