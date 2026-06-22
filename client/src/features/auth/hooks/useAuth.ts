import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const { user, accessToken, isLoading, setAuth, clearAuth } = useAuthStore();
  return { user, accessToken, isLoading, setAuth, logout: clearAuth, isAuthenticated: !!user };
}
