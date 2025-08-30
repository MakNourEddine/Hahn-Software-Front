export function getErrorMessage(e: unknown) {
    if (e instanceof Error && e.message) return e.message;
    try {
        return String(e);
    } catch {
        return "Unknown error";
    }
}
