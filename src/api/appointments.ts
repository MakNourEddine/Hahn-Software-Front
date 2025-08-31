import {http} from './http';
import type {Slot, AppointmentListItem} from '../lib/types';

export const AppointmentsApi = {
    availability: (dentistId: string, date: string) =>
        http<Slot[]>(`/availability?dentistId=${encodeURIComponent(dentistId)}&date=${date}`),

    listByDentist: (dentistId: string, date: string) =>
        http<AppointmentListItem[]>(`/appointments/by-dentist?dentistId=${encodeURIComponent(dentistId)}&date=${date}`),

    book: (args: { dentistId: string; patientId: string; serviceId: string; startUtc: string }) =>
        http<string>('/appointments/book', {method: 'POST', body: JSON.stringify(args)}),

    cancel: (id: string, reason: string) =>
        http<void>(`/appointments/${id}/cancel`, {method: 'POST', body: JSON.stringify({reason})}),

    reschedule: (id: string, newStartUtc: string) =>
        http<void>(`/appointments/${id}/reschedule`, {method: 'POST', body: JSON.stringify({newStartUtc})}),
};
