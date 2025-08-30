import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AppointmentsApi} from "../api/appointments";
import type {AppointmentDto} from "../lib/types";

export function useAppointments(dentistId: string, date: string) {
    return useQuery<AppointmentDto[], Error>({
        queryKey: ["appointments", dentistId, date],
        queryFn: () => AppointmentsApi.listByDentist(dentistId, date),
        enabled: !!dentistId && !!date,
    });
}

export function useBook() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: AppointmentsApi.book,
        onSuccess: (_data, v) => {
            qc.invalidateQueries({queryKey: ["availability", v.dentistId]});
            qc.invalidateQueries({queryKey: ["appointments", v.dentistId]});
        },
    });
}

export function useCancel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, reason}: { id: string; reason: string }) => AppointmentsApi.cancel(id, reason),
        onSuccess: () => qc.invalidateQueries({queryKey: ["appointments"]}),
    });
}

export function useReschedule() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, newStartUtc}: { id: string; newStartUtc: string }) =>
            AppointmentsApi.reschedule(id, newStartUtc),
        onSuccess: () => qc.invalidateQueries({queryKey: ["appointments"]}),
    });
}
