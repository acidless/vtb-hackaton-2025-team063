export default function getAbsoluteSeverUrl(path?: string): string {
    if (!path) {
        return "";
    }

    if (path.startsWith("http")) {
        return path;
    }

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    return `${base}${path}`;
}