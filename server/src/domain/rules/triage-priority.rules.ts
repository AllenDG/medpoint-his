import type { VitalsReading } from "../value-objects/VitalsReading";
import type { TriagePriority } from "../entities/TriageRecord";

export function calculateTriagePriority(vitals: VitalsReading): TriagePriority {
  const { oxygenSaturation, heartRate, bloodPressureSystolic } = vitals;
  if (oxygenSaturation < 90 || heartRate > 130 || bloodPressureSystolic < 80) return "P1";
  if (oxygenSaturation < 94 || heartRate > 110 || bloodPressureSystolic < 90) return "P2";
  if (oxygenSaturation < 96 || heartRate > 100) return "P3";
  return "P4";
}
