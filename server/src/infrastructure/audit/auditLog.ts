// Baked-in audit trail for all triage and ticket mutations
export async function auditLog(
  actorId: string,
  action: string,
  resourceId: string,
  meta?: Record<string, unknown>
) {
  // TODO: persist to audit_logs table via repository
  console.info("[AUDIT]", { actorId, action, resourceId, meta, timestamp: new Date().toISOString() });
}
