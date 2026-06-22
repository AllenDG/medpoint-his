import type { TriageRecord } from "@/domain/entities/TriageRecord";

export interface ITriageRepository {
  findQueue(): Promise<TriageRecord[]>;
  findById(id: string): Promise<TriageRecord | null>;
  create(data: Omit<TriageRecord, "id" | "createdAt">): Promise<TriageRecord>;
  update(id: string, data: Partial<TriageRecord>): Promise<TriageRecord>;
}
