import type { Role } from "@/types/api";
import { useAuth } from "./useAuth";

export function usePermissions(allowedRoles: Role[]): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
