type Opt = { value: string; label: string };

export default function Select({
                                   value, onChange, options, placeholder
                               }: { value?: string; onChange(v: string): void; options: Opt[]; placeholder?: string }) {
    return (
        <select
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            className="rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2"
        >
            <option value="" disabled>{placeholder ?? 'Select...'}</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}
