// src/shared/api/http.ts
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiError = {
  status: number;
  message: string;
  details?: any;
  url?: string;
};

type RequestOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  auth?: boolean; // default true
  // Si tu backend usa refresh token, puedes activar esto por request
  retryAuth?: boolean; // default true
};

type TokenPair = {
  accessToken: string | null;
  refreshToken?: string | null;
};

// ---- Config ----
// Vite: import.meta.env.VITE_API_URL
// CRA: process.env.REACT_APP_API_URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ---- Token storage (simple) ----
// Puedes reemplazar esto por tu AuthProvider/Context si ya lo tienes.
const STORAGE_KEYS = {
  access: "kardex.accessToken",
  refresh: "kardex.refreshToken",
};

function getTokens(): TokenPair {
  const accessToken = localStorage.getItem(STORAGE_KEYS.access);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refresh);
  return { accessToken, refreshToken };
}

function setTokens(tokens: TokenPair) {
  if (tokens.accessToken) localStorage.setItem(STORAGE_KEYS.access, tokens.accessToken);
  else localStorage.removeItem(STORAGE_KEYS.access);

  if (tokens.refreshToken !== undefined) {
    if (tokens.refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, tokens.refreshToken);
    else localStorage.removeItem(STORAGE_KEYS.refresh);
  }
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.access);
  localStorage.removeItem(STORAGE_KEYS.refresh);
}

// ---- Helpers ----
function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function readResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => null);
  }
  // fallback: text
  const text = await res.text().catch(() => "");
  return text || null;
}

function toApiError(status: number, data: any, url?: string): ApiError {
  // Ajusta esto a tu backend: a veces viene {message}, {error}, etc.
  const message =
    (data && (data.message || data.error || data.msg)) ||
    (typeof data === "string" && data) ||
    "Error en la solicitud";

  return { status, message, details: data, url };
}

// ---- Refresh token flow (opcional) ----
let refreshingPromise: Promise<string | null> | null = null;

/**
 * Implementa esto si ya tienes endpoint de refresh.
 * Ejemplo: POST /auth/refresh  { refreshToken }
 * Retorna { accessToken, refreshToken? }
 */
async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;

  // Evita 10 refresh al mismo tiempo
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    try {
      const url = buildUrl("/auth/refresh");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await readResponse(res);

      if (!res.ok) {
        clearTokens();
        return null;
      }

      // Ajusta nombres según tu backend
      const newAccess = data?.accessToken ?? data?.token ?? null;
      const newRefresh = data?.refreshToken ?? refreshToken;

      setTokens({ accessToken: newAccess, refreshToken: newRefresh });

      return newAccess;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

// ---- Core request ----
export async function request<TResponse = any, TBody = any>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    signal,
    auth = true,
    retryAuth = true,
  } = options;

  const url = buildUrl(path, params);

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  // Si body es FormData, no setees Content-Type (el browser lo hace con boundary)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json";
  }

  if (auth) {
    const { accessToken } = getTokens();
    if (accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
        ? (body as any)
        : finalHeaders["Content-Type"]?.includes("application/json")
        ? JSON.stringify(body)
        : (body as any),
    signal,
  });

  // Si 401, intenta refresh (si está habilitado)
  if (res.status === 401 && auth && retryAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<TResponse, TBody>(path, {
        ...options,
        retryAuth: false, // evita loop infinito
        headers: { ...headers, Authorization: `Bearer ${newToken}` },
      });
    }
  }

  const data = await readResponse(res);

  if (!res.ok) {
    throw toApiError(res.status, data, url);
  }

  return data as TResponse;
}

// ---- Shortcuts ----
export const http = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),

  post: <T, B = any>(path: string, body?: B, opts?: Omit<RequestOptions<B>, "method">) =>
    request<T, B>(path, { ...opts, method: "POST", body }),

  put: <T, B = any>(path: string, body?: B, opts?: Omit<RequestOptions<B>, "method">) =>
    request<T, B>(path, { ...opts, method: "PUT", body }),

  patch: <T, B = any>(path: string, body?: B, opts?: Omit<RequestOptions<B>, "method">) =>
    request<T, B>(path, { ...opts, method: "PATCH", body }),

  del: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};

// ---- Token helpers (para tu AuthProvider) ----
export const authTokens = {
  get: getTokens,
  set: setTokens,
  clear: clearTokens,
};