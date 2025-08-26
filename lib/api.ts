// approval_flow_frontend/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Ocurrió un error en la petición");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// AUTH
export const loginUser = (data: any) => apiFetch("auth/login", { method: "POST", body: JSON.stringify(data) });
export const getProfile = () => apiFetch("auth/profile");

// USERS
export const getUsers = () => apiFetch("users");
export const createUser = (data: any) => apiFetch("users", { method: "POST", body: JSON.stringify(data) });

// REQUEST TYPES
export const getRequestTypes = () => apiFetch("tipos-solicitud");
export const createRequestType = (data: any) => apiFetch("tipos-solicitud", { method: "POST", body: JSON.stringify(data) });

// REQUESTS (SOLICITUDES)
export const getMyRequests = () => apiFetch("solicitudes/outbox");
export const getPendingApprovals = () => apiFetch("solicitudes/inbox");
export const getRequestById = (id: string) => apiFetch(`solicitudes/${id}`);
export const createRequest = (data: any) => apiFetch("solicitudes", { method: "POST", body: JSON.stringify(data) });
export const updateRequestStatus = (id: string, data: any) => apiFetch(`solicitudes/${id}/estado`, { method: "PATCH", body: JSON.stringify(data) });
// FUNCIÓN NUEVA PARA LA MEJORA 4
export const getAssignedToMe = () => apiFetch("solicitudes/assigned-to-me");

// HISTORY
export const getHistory = () => apiFetch("historial");