import type {Slot} from "../lib/types";

export default function SlotGrid({slots, onPick}: { slots: Slot[]; onPick(s: Slot): void }) {
    if (!slots?.length) return <p className="text-sm text-slate-400">No free 15-minute slots for this day.</p>;
    return (
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))] gap-2">
            {slots.map((s, i) => (
                <button
                    key={i}
                    className="rounded-lg border border-[rgb(var(--border))] bg-[#0f141a] px-3 py-2 text-left hover:border-sky-500"
                    title={`${s.startUtc} → ${s.endUtc}`}
                    onClick={() => onPick(s)}
                >
                    {new Date(s.startUtc).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                    {" – "}
                    {new Date(s.endUtc).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                </button>
            ))}
        </div>
    );
}
