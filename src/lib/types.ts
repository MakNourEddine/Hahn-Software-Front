export type Dentist = { id: string; fullName: string };
export type Patient = { id: string; fullName: string; email: string };
export type Service = { id: string; name: string; durationMinutes: number };

export type Slot = { startUtc: string; endUtc: string };

export enum AppointmentStatus {
    Scheduled = 0,
    Cancelled = 1
}

export type AppointmentListItem = {
    id: string;
    startUtc: string;
    durationMinutes: number;
    status: AppointmentStatus;
    patientId: string;
    patientName: string;
    serviceId: string;
    serviceName: string;
};
