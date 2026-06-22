import { apiClient } from "@/lib/apiClient";
import type { Ticket } from "@/types/api";

export const helpdeskApi = {
  getTickets: (params?: unknown) =>
    apiClient.get<Ticket[]>("/helpdesk/tickets", { params }).then((r) => r.data),

  getTicket: (id: string) =>
    apiClient.get<Ticket>(`/helpdesk/tickets/${id}`).then((r) => r.data),

  createTicket: (payload: unknown) =>
    apiClient.post<Ticket>("/helpdesk/tickets", payload).then((r) => r.data),

  updateTicketStatus: (id: string, status: Ticket["status"]) =>
    apiClient.patch<Ticket>(`/helpdesk/tickets/${id}/status`, { status }).then((r) => r.data),

  escalateTicket: (id: string, notes: string) =>
    apiClient.post(`/helpdesk/tickets/${id}/escalate`, { notes }).then((r) => r.data),
};
