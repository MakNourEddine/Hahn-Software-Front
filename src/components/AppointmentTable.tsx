import type {AppointmentDto} from "../lib/types";
import Button from "./ui/Button";

export default function AppointmentTable({
                                             items, onCancel, onReschedule,
                                         }: {
    items: AppointmentDto[];
    onCancel(id: string): void;
    onReschedule(id: string): void
}) {
    if (!items?.length) return <p className="text-sm text-slate-400">No appointments yet.</p>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead className="text-slate-300">
                <tr className="border-b border-[rgb(var(--border))]">
                    <th className="p-2 text-left">Start (local)</th>
                    <th className="p-2 text-left">Duration</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map(a => (
                    <tr key={a.id} className="border-b border-[rgb(var(--border))]">
                        <td className="p-2">{new Date(a.startUtc).toLocaleString()}</td>
                        <td className="p-2">{a.durationMinutes} min</td>
                        <td className="p-2">
                <span
                    className={`rounded-md border px-2 py-0.5 ${a.status === 0 ? "border-green-600 text-green-400" : "border-amber-600 text-amber-400"}`}>
                  {a.status === 0 ? "Scheduled" : "Cancelled"}
                </span>
                        </td>
                        <td className="p-2 space-x-2">
                            <Button variant="ghost" onClick={() => onReschedule(a.id)}>Reschedule</Button>
                            <Button onClick={() => onCancel(a.id)}>Cancel</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
