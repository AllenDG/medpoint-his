import { apiClient } from "@/lib/apiClient";

export const publicApi = {
  searchDoctors: (query: string) =>
    apiClient.get("/public/doctors", { params: { q: query } }).then((r) => r.data),

  submitAppointment: (payload: unknown) =>
    apiClient.post("/public/appointments", payload).then((r) => r.data),

  getServices: () =>
    apiClient.get("/public/services").then((r) => r.data),
};
