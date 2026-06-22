import { auditLog } from "@/infrastructure/audit/auditLog";
import type { ITicketRepository } from "../../interfaces/ITicketRepository";

export class EscalateTicketUseCase {
  constructor(private tickets: ITicketRepository) {}

  async execute(actorId: string, ticketId: string, notes: string) {
    const ticket = await this.tickets.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const updated = await this.tickets.update(ticketId, { status: "ESCALATED" });
    await auditLog(actorId, "ESCALATE_TICKET", ticketId, { notes });
    return updated;
  }
}
