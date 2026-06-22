import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types/api";

interface LoginPayload { email: string; password: string; }
interface LoginResponse { user: User; accessToken: string; }

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", payload).then((r) => r.data),

  logout: () =>
    apiClient.post("/auth/logout"),

  refresh: () =>
    apiClient.post<{ accessToken: string }>("/auth/refresh").then((r) => r.data),
};
