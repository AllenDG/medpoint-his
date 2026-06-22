import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publicApi } from "../services/publicApi";

export function useAppointmentSubmit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: publicApi.submitAppointment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}
