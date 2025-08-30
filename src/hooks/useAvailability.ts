import {useQuery} from "@tanstack/react-query";
import {AppointmentsApi} from "../api/appointments";
import type {Slot} from "../lib/types";

export function useAvailability(dentistId: string, date: string) {
    return useQuery<Slot[], Error>({
        queryKey: ["availability", dentistId, date],
        queryFn: () => AppointmentsApi.availability(dentistId, date),
        enabled: !!dentistId && !!date,
        staleTime: 30_000,
    });
}
