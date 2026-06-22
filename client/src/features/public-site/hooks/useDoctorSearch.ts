import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { publicApi } from "../services/publicApi";

export function useDoctorSearch(query: string) {
  const debounced = useDebounce(query, 400);
  return useQuery({
    queryKey: ["doctors", debounced],
    queryFn: () => publicApi.searchDoctors(debounced),
    enabled: debounced.length > 1,
  });
}
