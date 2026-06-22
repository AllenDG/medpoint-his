import { useQuery } from "@tanstack/react-query";
import { helpdeskApi } from "../services/helpdeskApi";

export function useTicketQueue(filters?: unknown) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => helpdeskApi.getTickets(filters),
    refetchInterval: 30_000,
  });
}
