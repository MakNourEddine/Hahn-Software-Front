import {http} from './http';
import type {Dentist, Patient, Service} from '../lib/types';

export const EntitiesApi = {
    dentists: () => http<Dentist[]>('/dentists'),
    patients: () => http<Patient[]>('/patients'),
    services: () => http<Service[]>('/services'),

    createDentist: (name: string) => http<string>('/dentists', {
        method: 'POST',
        body: JSON.stringify({fullName: name})
    }),
    updateDentist: (id: string, name: string) => http<void>(`/dentists/${id}`, {
        method: 'PUT',
        body: JSON.stringify({id, fullName: name})
    }),
    deleteDentist: (id: string) => http<void>(`/dentists/${id}`, {method: 'DELETE'}),

    createPatient: (fullName: string, email: string) => http<string>('/patients', {
        method: 'POST',
        body: JSON.stringify({fullName, email})
    }),
    updatePatient: (id: string, fullName: string, email: string) => http<void>(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify({id, fullName, email})
    }),
    deletePatient: (id: string) => http<void>(`/patients/${id}`, {method: 'DELETE'}),

    createService: (name: string, durationMinutes: number) => http<string>('/services', {
        method: 'POST',
        body: JSON.stringify({name, durationMinutes})
    }),
    updateService: (id: string, name: string, durationMinutes: number) => http<void>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({id, name, durationMinutes})
    }),
    deleteService: (id: string) => http<void>(`/services/${id}`, {method: 'DELETE'}),
};
