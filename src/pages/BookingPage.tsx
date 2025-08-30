import {useState} from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {Input} from "../components/ui/Input";
import SlotGrid from "../components/SlotGrid";
import AppointmentTable from "../components/AppointmentTable";
import {yyyyMMdd, toUtcIso} from "../lib/datetime";
import {useAppointments, useBook, useCancel, useReschedule} from "../hooks/useAppointments";
import {useSettingsStore} from "../store/settings";
import type {Slot} from "../lib/types";
import {toast} from "sonner";
import * as React from "react";
import {useAvailability} from "../hooks/useAvailability.ts";

export default function BookingPage() {
    const {dentistId, patientId, serviceId, setDentistId, setPatientId, setServiceId} = useSettingsStore();
    const [date, setDate] = useState(yyyyMMdd());
    const [time, setTime] = useState("09:00");

    const avail = useAvailability(dentistId, date);
    const list = useAppointments(dentistId, date);
    const book = useBook();
    const cancelMut = useCancel();
    const rescheduleMut = useReschedule();

    async function bookFromSlot(slot: Slot) {
        if (!dentistId || !patientId || !serviceId) return toast.error("Fill Dentist/Patient/Service first");
        await book.mutateAsync({dentistId, patientId, serviceId, startUtc: slot.startUtc});
        toast.success("Booked!");
        await Promise.all([avail.refetch(), list.refetch()]);
    }

    async function bookFromTime() {
        if (!dentistId || !patientId || !serviceId) return toast.error("Fill Dentist/Patient/Service first");
        const startUtc = toUtcIso(date, time);
        await book.mutateAsync({dentistId, patientId, serviceId, startUtc});
        toast.success("Booked!");
        await Promise.all([avail.refetch(), list.refetch()]);
    }

    async function cancel(id: string) {
        const reason = window.prompt("Reason?", "Schedule change") ?? "";
        if (!reason) return;
        await cancelMut.mutateAsync({id, reason});
        toast("Appointment cancelled");
        await list.refetch();
    }

    async function reschedule(id: string) {
        const d = window.prompt("New date (YYYY-MM-DD)", date) ?? date;
        const t = window.prompt("New time (HH:mm)", time) ?? time;
        const newStartUtc = toUtcIso(d, t);
        await rescheduleMut.mutateAsync({id, newStartUtc});
        toast("Appointment rescheduled");
        await list.refetch();
    }

    return (
        <div className="space-y-6">
            <Card className="space-y-3">
                <h2 className="text-lg font-semibold">Setup</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                    <Labeled label="Dentist Id"><Input value={dentistId} onChange={e => setDentistId(e.target.value)}
                                                       placeholder="GUID"/></Labeled>
                    <Labeled label="Patient Id"><Input value={patientId} onChange={e => setPatientId(e.target.value)}
                                                       placeholder="GUID"/></Labeled>
                    <Labeled label="Service Id"><Input value={serviceId} onChange={e => setServiceId(e.target.value)}
                                                       placeholder="GUID"/></Labeled>
                </div>
                <p className="text-sm text-slate-400">Paste your seeded GUIDs from the API/DB here.</p>
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Availability</h2>
                    <div className="flex gap-2">
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)}/>
                        <Button onClick={() => avail.refetch()} disabled={!dentistId || avail.isFetching}>Load</Button>
                    </div>
                </div>
                {avail.isError ? <p className="text-rose-400 text-sm">{(avail.error as Error).message}</p> : null}
                {avail.isLoading ? <p className="text-slate-400">Loading…</p> :
                    <SlotGrid slots={avail.data ?? []} onPick={bookFromSlot}/>}
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Quick Book</h2>
                    <div className="flex gap-2">
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)}/>
                        <Input type="time" step={900} value={time} onChange={e => setTime(e.target.value)}/>
                        <Button onClick={bookFromTime} disabled={!dentistId || book.isPending}>Book</Button>
                    </div>
                </div>
                <p className="text-sm text-slate-400">Local time is converted to UTC and sent to the API.</p>
            </Card>

            <Card className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold">Appointments</h2>
                    <div className="flex gap-2">
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)}/>
                        <Button variant="ghost" onClick={() => list.refetch()}
                                disabled={!dentistId || list.isFetching}>Refresh</Button>
                    </div>
                </div>
                {list.isError ? <p className="text-rose-400 text-sm">{(list.error as Error).message}</p> : null}
                {list.isLoading ? <p className="text-slate-400">Loading…</p> :
                    <AppointmentTable items={list.data ?? []} onCancel={cancel} onReschedule={reschedule}/>}
            </Card>
        </div>
    );
}

function Labeled({label, children}: { label: string; children: React.ReactNode }) {
    return (
        <label className="space-y-1">
            <span className="text-sm text-slate-300">{label}</span>
            {children}
        </label>
    );
}
