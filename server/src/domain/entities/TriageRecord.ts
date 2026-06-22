import type { VitalsReading } from "../value-objects/VitalsReading";

export type TriageStatus   = "WAITING" | "IN_TRIAGE" | "ESCALATED" | "DISCHARGED";
export type TriagePriority = "P1" | "P2" | "P3" | "P4";

export interface TriageRecord {
  id: string;
  patientId: string;
  nursedBy: string;
  vitals: VitalsReading;
  priority: TriagePriority;
  status: TriageStatus;
  notes?: string;
  createdAt: Date;
}
