import { z } from "zod";

export const StudentAdmissionSchema = z.object({
  admissionNumber: z.string().min(3, "Admission number is required"),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(6, "Valid date of birth required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  photoUrl: z.string().url().optional().or(z.literal("")),
  admissionDate: z.string().min(6, "Admission date required"),
  status: z.enum(["ACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED", "INACTIVE"]).default("ACTIVE"),
  className: z.string().min(1, "Class selection is required"),
  streamName: z.string().min(1, "Stream selection is required"),
  curriculum: z.enum(["CBC", "Cambridge International"]).default("CBC"),

  // Contact
  address: z.string().min(3, "Residential address is required"),
  county: z.string().default("Nairobi"),

  // Parent / Guardian
  parentFullName: z.string().min(3, "Parent/Guardian full name is required"),
  parentRelationship: z.enum(["Father", "Mother", "Guardian"]),
  parentPhone: z
    .string()
    .min(10, "Valid phone number required (e.g. +254 700 000 000)"),
  parentEmail: z.string().email("Valid parent email address required"),
  parentOccupation: z.string().optional(),

  // Medical
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  emergencyDoctor: z.string().optional(),
  emergencyPhone: z.string().min(8, "Emergency contact phone is required"),
});

export type StudentAdmissionInput = z.infer<typeof StudentAdmissionSchema>;
