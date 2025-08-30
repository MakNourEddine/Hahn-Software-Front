import {http} from "./http.ts";
import type {Slot, AppointmentDto} from "../lib/types.ts";

export const AppointmentsApi = {
    availability: (dentistId: string, date: string) =>
        http<Slot[]>(`/availability?dentistId=${encodeURIComponent(dentistId)}&date=${date}`),

    listByDentist: (dentistId: string, date: string) =>
        http<AppointmentDto[]>(`/appointments/by-dentist?dentistId=${encodeURIComponent(dentistId)}&date=${date}`),

    book: (body: { dentistId: string; patientId: string; serviceId: string; startUtc: string }) =>
        http<string>("/appointments/book", {method: "POST", body: JSON.stringify(body)}),

    cancel: (id: string, reason: string) =>
        http<void>(`/appointments/${id}/cancel`, {method: "POST", body: JSON.stringify({reason})}),

    reschedule: (id: string, newStartUtc: string) =>
        http<void>(`/appointments/${id}/reschedule`, {method: "POST", body: JSON.stringify({newStartUtc})}),
};
