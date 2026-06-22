export type TicketStatus   = "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
  id: string;
  patientId: string;
  assignedTo?: string;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  description: string;
  slaBreachedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
