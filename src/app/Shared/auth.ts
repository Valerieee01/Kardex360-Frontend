export function getCurrentUserId(): string {
  try {
    const raw = localStorage.getItem("kardex.user");

    if (!raw) return "";

    const user = JSON.parse(raw);

    return String(user.id || "");
  } catch {
    return "";
  }
}