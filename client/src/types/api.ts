export type Role = "PATIENT" | "HELPDESK" | "NURSE" | "DOCTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

// Entities
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string;
}

export interface Ticket {
  id: string;
  patientId: string;
  assignedTo?: string;
  status: "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  description: string;
  createdAt: string;
  slaBreached: boolean;
}

export interface TriageRecord {
  id: string;
  patientId: string;
  vitals: VitalsReading;
  priority: "P1" | "P2" | "P3" | "P4";
  status: "WAITING" | "IN_TRIAGE" | "ESCALATED" | "DISCHARGED";
  notes?: string;
  createdAt: string;
}

export interface VitalsReading {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  weight?: number;
}
