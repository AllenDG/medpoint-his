import { calculateTriagePriority } from "@/domain/rules/triage-priority.rules";
import { auditLog } from "@/infrastructure/audit/auditLog";
import type { ITriageRepository } from "../../interfaces/ITriageRepository";
import type { VitalsReading } from "@/domain/value-objects/VitalsReading";

export class RecordVitalsUseCase {
  constructor(private triage: ITriageRepository) {}

  async execute(actorId: string, patientId: string, vitals: VitalsReading) {
    const priority = calculateTriagePriority(vitals);
    const record = await this.triage.create({
      patientId,
      nursedBy: actorId,
      vitals,
      priority,
      status: "IN_TRIAGE",
    });
    await auditLog(actorId, "RECORD_VITALS", record.id, { priority });
    return record;
  }
}
