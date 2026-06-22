import { usePermissions } from "../hooks/usePermissions";
import type { Role } from "@/types/api";

interface Props { allowedRoles: Role[]; children: React.ReactNode; fallback?: React.ReactNode; }

export function RoleGate({ allowedRoles, children, fallback = null }: Props) {
  const allowed = usePermissions(allowedRoles);
  return <>{allowed ? children : fallback}</>;
}
