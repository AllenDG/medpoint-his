import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nurseApi } from "../services/nurseApi";
import type { VitalsReading } from "@/types/api";

export function useVitalsSubmit(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vitals: VitalsReading) => nurseApi.recordVitals(patientId, vitals),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["triage-queue"] }),
  });
}
