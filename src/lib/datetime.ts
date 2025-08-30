export const yyyyMMdd = (d = new Date()) => d.toISOString().slice(0, 10);

export function toUtcIso(date: string, time: string): string {
    const [y, m, da] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const local = new Date(y, m - 1, da, hh, mm, 0);
    return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
}
