import { apiClient } from "@/lib/apiClient";
import type { TriageRecord, VitalsReading } from "@/types/api";

export const nurseApi = {
  getTriageQueue: () =>
    apiClient.get<TriageRecord[]>("/nurse/triage").then((r) => r.data),

  recordVitals: (patientId: string, vitals: VitalsReading) =>
    apiClient.post<TriageRecord>(`/nurse/patients/${patientId}/vitals`, vitals).then((r) => r.data),

  escalateToDoctor: (triageId: string, notes: string) =>
    apiClient.post(`/nurse/triage/${triageId}/escalate`, { notes }).then((r) => r.data),
};
