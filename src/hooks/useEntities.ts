import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {EntitiesApi} from '../api/entities';
import type {Dentist, Patient, Service} from '../lib/types';

export const useDentists = () => useQuery<Dentist[], Error>({queryKey: ['dentists'], queryFn: EntitiesApi.dentists});
export const usePatients = () => useQuery<Patient[], Error>({queryKey: ['patients'], queryFn: EntitiesApi.patients});
export const useServices = () => useQuery<Service[], Error>({queryKey: ['services'], queryFn: EntitiesApi.services});

export function useDentistCrud() {
    const qc = useQueryClient();
    return {
        create: useMutation({
            mutationFn: EntitiesApi.createDentist,
            onSuccess: () => qc.invalidateQueries({queryKey: ['dentists']})
        }),
        update: useMutation({
            mutationFn: ({id, name}: {
                id: string;
                name: string
            }) => EntitiesApi.updateDentist(id, name), onSuccess: () => qc.invalidateQueries({queryKey: ['dentists']})
        }),
        remove: useMutation({
            mutationFn: EntitiesApi.deleteDentist,
            onSuccess: () => qc.invalidateQueries({queryKey: ['dentists']})
        }),
    };
}
