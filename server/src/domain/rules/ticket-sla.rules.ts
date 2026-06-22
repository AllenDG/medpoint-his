import type { Ticket } from "../entities/Ticket";

const SLA_HOURS: Record<Ticket["priority"], number> = {
  URGENT: 1,
  HIGH:   4,
  MEDIUM: 24,
  LOW:    72,
};

export function checkSlaBreach(ticket: Ticket): boolean {
  const ageMs = Date.now() - new Date(ticket.createdAt).getTime();
  const slaMs = SLA_HOURS[ticket.priority] * 60 * 60 * 1000;
  return ageMs > slaMs && ticket.status !== "RESOLVED";
}
