import {useState} from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';

type Row = Record<string, any>;

export default function CrudPage<T extends Row>({
                                                    title,
                                                    rows,
                                                    columns,
                                                    onCreate,
                                                    onUpdate,
                                                    onDelete,
                                                }: {
    title: string;
    rows: T[] | undefined;
    columns: { key: keyof T; label: string }[];
    onCreate(fields: Record<string, any>): Promise<void>;
    onUpdate(id: string, fields: Record<string, any>): Promise<void>;
    onDelete(id: string): Promise<void>;
}) {
    const [createFields, setCreateFields] = useState<Record<string, any>>({});
    const [editing, setEditing] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<Record<string, any>>({});

    return (
        <Card className="space-y-4">
            <h2 className="text-lg font-semibold">{title}</h2>

            {/* Create */}
            <div className="flex flex-wrap gap-2 items-end">
                {columns.filter(c => c.key !== 'id').map(c => (
                    <label key={String(c.key)} className="space-y-1">
                        <span className="text-sm text-slate-300">{c.label}</span>
                        <Input value={createFields[c.key as string] ?? ''}
                               onChange={e => setCreateFields(s => ({...s, [c.key]: e.target.value}))}/>
                    </label>
                ))}
                <Button onClick={async () => {
                    await onCreate(createFields);
                    setCreateFields({});
                }}>Add</Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="text-slate-300">
                    <tr className="border-b border-[rgb(var(--border))]">
                        {columns.map(c => <th key={String(c.key)} className="p-2 text-left">{c.label}</th>)}
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(rows ?? []).map(r => {
                        const isEditing = editing === r.id;
                        return (
                            <tr key={r.id} className="border-b border-[rgb(var(--border))]">
                                {columns.map(c => (
                                    <td key={String(c.key)} className="p-2">
                                        {isEditing && c.key !== 'id' ? (
                                            <Input value={editFields[c.key as string] ?? r[c.key]}
                                                   onChange={e => setEditFields(s => ({
                                                       ...s,
                                                       [c.key]: e.target.value
                                                   }))}/>
                                        ) : String(r[c.key])}
                                    </td>
                                ))}
                                <td className="p-2 space-x-2">
                                    {isEditing ? (
                                        <>
                                            <Button variant="ghost" onClick={async () => {
                                                await onUpdate(r.id, editFields);
                                                setEditing(null);
                                            }}>Save</Button>
                                            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="ghost" onClick={() => {
                                                setEditing(r.id);
                                                setEditFields({});
                                            }}>Edit</Button>
                                            <Button onClick={() => onDelete(r.id)}>Delete</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
