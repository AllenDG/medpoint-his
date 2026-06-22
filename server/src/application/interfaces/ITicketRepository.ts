import type { Ticket } from "@/domain/entities/Ticket";

export interface ITicketRepository {
  findById(id: string): Promise<Ticket | null>;
  findAll(filters?: Partial<Ticket>): Promise<Ticket[]>;
  create(data: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket>;
  update(id: string, data: Partial<Ticket>): Promise<Ticket>;
}
