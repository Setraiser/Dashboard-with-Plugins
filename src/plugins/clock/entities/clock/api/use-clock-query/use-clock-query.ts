import { useQuery } from "@tanstack/react-query";

interface ClockApiResponse {
  nowIso: string;
}

export function useClockQuery(instanceId: string) {
  return useQuery({
    queryKey: ["clock", instanceId, "time"],
    queryFn: async () => {
      const response = await fetch("/api/plugins/clock/time");
      if (!response.ok) throw new Error("Failed to get time");
      return (await response.json()) as ClockApiResponse;
    },
    refetchInterval: 60_000,
  });
}
