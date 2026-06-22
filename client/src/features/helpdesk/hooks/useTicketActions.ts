import { useMutation, useQueryClient } from "@tanstack/react-query";
import { helpdeskApi } from "../services/helpdeskApi";

export function useTicketActions() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["tickets"] });

  const escalate = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      helpdeskApi.escalateTicket(id, notes),
    onSuccess: invalidate,
  });

  return { escalate };
}
