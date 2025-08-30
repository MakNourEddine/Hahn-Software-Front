export type Slot = { startUtc: string; endUtc: string };

export enum AppointmentStatus {
    Scheduled = 0,
    Cancelled = 1
}

export type AppointmentDto = {
    id: string;
    startUtc: string;
    durationMinutes: number;
    status: AppointmentStatus;
    patientId: string;
    serviceId: string;
};
