export type SessionUser = {
  id: string;
  nombre: string;
  roles: string[];
};

const USER_KEY = "kardex.user";

export function getStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}