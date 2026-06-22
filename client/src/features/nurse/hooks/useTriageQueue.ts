import { useQuery } from "@tanstack/react-query";
import { nurseApi } from "../services/nurseApi";

export function useTriageQueue() {
  return useQuery({
    queryKey: ["triage-queue"],
    queryFn: nurseApi.getTriageQueue,
    refetchInterval: 15_000,
  });
}
