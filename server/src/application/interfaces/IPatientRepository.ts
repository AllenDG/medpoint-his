import type { Patient } from "@/domain/entities/Patient";

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findAll(query?: string): Promise<Patient[]>;
  create(data: Omit<Patient, "id" | "createdAt">): Promise<Patient>;
}
