import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Role } from "@/types/api";

interface Props {
  allowedRoles: Role[];
  loginPath?: string;
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, loginPath = "/login", children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to={loginPath} replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
