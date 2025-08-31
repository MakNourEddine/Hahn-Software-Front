import {useEffect, useMemo, useState} from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import SlotGrid from '../components/SlotGrid';
import AppointmentTable from '../components/AppointmentTable';
import {yyyyMMdd, toUtcIso} from '../lib/datetime';
import {useAppointments, useBook, useCancel, useReschedule} from '../hooks/useAppointments';
import {useDentists, usePatients, useServices} from '../hooks/useEntities';
import type {Slot} from '../lib/types';
import {toast} from 'sonner';
import {useAvailability} from "../hooks/useAvailability.ts";

export default function BookingPage() {
    const [date, setDate] = useState(yyyyMMdd());
    const [time, setTime] = useState('09:00');

    const dentists = useDentists();
    const patients = usePatients();
    const services = useServices();

    const [dentistId, setDentistId] = useState<string>();
    const [patientId, setPatientId] = useState<string>();
    const [serviceId, setServiceId] = useState<string>();

    useEffect(() => {
        if (!dentistId && dentists.data?.[0]) setDentistId(dentists.data[0].id);
    }, [dentists.data]);
    useEffect(() => {
        if (!patientId && patients.data?.[0]) setPatientId(patients.data[0].id);
    }, [patients.data]);
    useEffect(() => {
        if (!serviceId && services.data?.[0]) setServiceId(services.data[0].id);
    }, [services.data]);

    const avail = useAvailability(dentistId ?? '', date);
    const list = useAppointments(dentistId ?? '', date);
    const book = useBook();
    const cancelMut = useCancel();
    const rescheduleMut = useReschedule();

    const options = {
        dentists: (dentists.data ?? []).map(d => ({value: d.id, label: d.fullName})),
        patients: (patients.data ?? []).map(p => ({value: p.id, label: p.fullName})),
        services: (services.data ?? []).map(s => ({value: s.id, label: `${s.name} (${s.durationMinutes}m)`})),
    };

    const now = new Date();
    const futureSlots: Slot[] = useMemo(
        () => (avail.data ?? []).filter((s: Slot) => new Date(s.startUtc) > now),
        [avail.data]
    );

    async function bookFromSlot(slot: Slot) {
        if (!dentistId || !patientId || !serviceId) return toast.error('Select dentist/patient/service');
        await book.mutateAsync({dentistId, patientId, serviceId, startUtc: slot.startUtc});
        toast.success('Booked!');
        await Promise.all([avail.refetch(), list.refetch()]);
    }

    async function bookFromTime() {
        if (!dentistId || !patientId || !serviceId) return toast.error('Select dentist/patient/service');
        const startUtc = toUtcIso(date, time);
        if (new Date(startUtc) <= new Date()) return toast.error('Pick a future time');
        await book.mutateAsync({dentistId, patientId, serviceId, startUtc});
        toast.success('Booked!');
        await Promise.all([avail.refetch(), list.refetch()]);
    }

    async function cancel(id: string) {
        const reason = window.prompt('Reason?', 'Schedule change') ?? '';
        if (!reason) return;
        await cancelMut.mutateAsync({id, reason});
        toast('Appointment cancelled');
        await list.refetch();
    }

    async function reschedule(id: string) {
        const d = window.prompt('New date (YYYY-MM-DD)', date) ?? date;
        const t = window.prompt('New time (HH:mm)', time) ?? time;
        const newStartUtc = toUtcIso(d, t);
        if (new Date(newStartUtc) <= new Date()) return toast.error('Pick a future time');
        await rescheduleMut.mutateAsync({id, newStartUtc});
        toast('Appointment rescheduled');
        await list.refetch();
    }

    const ready = !!dentistId && !!date;

    return (
        <div className="space-y-6">
            <Card className="space-y-3">
                <h2 className="text-lg font-semibold">Choose Dentist / Patient / Service</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                        <span className="text-sm text-slate-300">Dentist</span>
                        <Select value={dentistId} onChange={setDentistId} options={options.dentists}
                                placeholder="Select dentist"/>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-slate-300">Patient</span>
                        <Select value={patientId} onChange={setPatientId} options={options.patients}
                                placeholder="Select patient"/>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-slate-300">Service</span>
                        <Select value={serviceId} onChange={setServiceId} options={options.services}
                                placeholder="Select service"/>
                    </div>
                </div>
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Availability</h2>
                    <div className="flex gap-2">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                               className="rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2"/>
                        <Button onClick={() => avail.refetch()} disabled={!ready || avail.isFetching}>Load</Button>
                    </div>
                </div>
                {avail.isError ? <p className="text-rose-400 text-sm">{(avail.error as Error).message}</p> : null}
                {avail.isLoading ? <p className="text-slate-400">Loading…</p> :
                    <SlotGrid slots={futureSlots} onPick={bookFromSlot}/>}
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Quick Book</h2>
                    <div className="flex gap-2">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                               className="rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2"/>
                        <input type="time" step={900} value={time} onChange={e => setTime(e.target.value)}
                               className="rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2"/>
                        <Button onClick={bookFromTime} disabled={!ready || book.isPending}>Book</Button>
                    </div>
                </div>
                <p className="text-sm text-slate-400">Only future times are allowed.</p>
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Appointments</h2>
                    <div className="flex gap-2">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                               className="rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2"/>
                        <Button variant="ghost" onClick={() => list.refetch()}
                                disabled={!ready || list.isFetching}>Refresh</Button>
                    </div>
                </div>
                {list.isError ? <p className="text-rose-400 text-sm">{(list.error as Error).message}</p> : null}
                {list.isLoading ? <p className="text-slate-400">Loading…</p> :
                    <AppointmentTable items={list.data ?? []} onCancel={cancel} onReschedule={reschedule}/>}
            </Card>
        </div>
    );
}
