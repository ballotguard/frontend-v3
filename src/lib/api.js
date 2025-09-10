const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

import { storage, TOKEN_KEYS } from "./storage";

// Ensure only one refresh happens at a time
let refreshPromise = null;
let refreshTimer = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function base64UrlDecode(str) {
  try {
    const pad = (s) => s + "===".slice((s.length + 3) % 4);
    const b64 = pad(str.replace(/-/g, "+").replace(/_/g, "/"));
    if (typeof atob !== "undefined") return decodeURIComponent(escape(atob(b64)));
    // Node fallback
    return Buffer.from(b64, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function parseJwtExp(jwt) {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson || "{}");
    return typeof payload.exp === "number" ? payload.exp : null; // seconds since epoch
  } catch {
    return null;
  }
}

function scheduleRefreshFromJwt(jwt) {
  clearRefreshTimer();
  const exp = parseJwtExp(jwt);
  if (!exp) return; // can't schedule without exp
  const now = Date.now();
  const target = exp * 1000 - 30_000; // refresh 30s before expiry
  const delay = Math.max(5_000, target - now); // minimum 5s
  refreshTimer = setTimeout(async () => {
    await queueRefreshJwt();
    const latest = storage.get(TOKEN_KEYS.jwt);
    if (latest) scheduleRefreshFromJwt(latest); // chain next schedule
  }, delay);
}

async function request(path, { method = "GET", body, headers, auth = true, retryOn401 = true } = {}) {
  const token = auth ? storage.get(TOKEN_KEYS.jwt) : null;
  const url = `${BASE_URL}${path}`;

  const init = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  };

  let res = await fetch(url, init);

  if (res.status === 401 && auth && retryOn401 && !isRefreshEndpoint(path)) {
    const refreshed = await queueRefreshJwt();
    if (refreshed) {
      const retryToken = storage.get(TOKEN_KEYS.jwt);
      const retryInit = {
        ...init,
        headers: {
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(auth && retryToken ? { Authorization: `Bearer ${retryToken}` } : {}),
          ...(headers || {}),
        },
      };
      res = await fetch(url, retryInit);
    } else {
      // refresh failed; clear tokens to avoid loops
      storage.remove(TOKEN_KEYS.jwt);
      storage.remove(TOKEN_KEYS.refresh);
    }
  }

  return handleResponse(res);
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const error = new Error(data?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

function isRefreshEndpoint(path) {
  return path.includes("/api/v1/auth/refresh");
}

async function doRefreshJwt() {
  const refreshToken = storage.get(TOKEN_KEYS.refresh);
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.jwt) {
      storage.set(TOKEN_KEYS.jwt, data.jwt);
      scheduleRefreshFromJwt(data.jwt);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

async function queueRefreshJwt() {
  if (!refreshPromise) {
    refreshPromise = doRefreshJwt()
      .catch(() => false)
      .finally(() => {
        // reset after completion to allow future refreshes
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export const api = {
  // Auth
  signup: (payload) => request(`/api/v1/auth/signup`, { method: "POST", body: payload }),
  login: (payload) => request(`/api/v1/auth/login`, { method: "POST", body: payload }),
  sendEmailVerification: () => request(`/api/v1/auth/email-verification/code`, { method: "POST" }),
  verifyEmailCode: (payload) => request(`/api/v1/auth/email-verification/verify`, { method: "POST", body: payload }),
  sendResetCode: (payload) => request(`/api/v1/auth/password-reset/code`, { method: "POST", body: payload }),
  verifyAndReset: (payload) => request(`/api/v1/auth/password-reset/verify-and-reset`, { method: "POST", body: payload }),

  getUser: () => request(`/api/v1/user`, { method: "GET" }),
  deleteUser: () => request(`/api/v1/user/delete`, { method: "DELETE" }),
  resetPasswordLoggedIn: (payload) => request(`/api/v1/user/password-reset`, { method: "PUT", body: payload }),

  getUserSettings: () => request(`/api/v1/user/settings`, { method: "GET" }),
  updateUserSettings: (payload) => request(`/api/v1/user/settings`, { method: "PUT", body: payload }),

  // Elections
  createElection: (payload) => request(`/api/v1/user/election/create`, { method: "POST", body: payload }),
  // Per docs: complete election update uses PATCH
  updateElection: (payload) => request(`/api/v1/user/election/update`, { method: "PATCH", body: payload }),
  deleteElection: (payload) => request(`/api/v1/user/election/delete`, { method: "DELETE", body: payload }),
  findAllElections: () => request(`/api/v1/user/election/find-all`, { method: "GET" }),
  findElection: ({ electionId }) => request(`/api/v1/user/election/find?electionId=${encodeURIComponent(electionId)}`, { method: "GET" }),
  // Results endpoint: GET with electionId as query param (no request body)
  electionResult: ({ electionId }) => request(`/api/v1/user/election/result?electionId=${encodeURIComponent(electionId)}`, { method: "GET" }),

  updateElectionName: (payload) => request(`/api/v1/user/election/update/name`, { method: "PATCH", body: payload }),
  updateElectionDescription: (payload) => request(`/api/v1/user/election/update/description`, { method: "PATCH", body: payload }),
  updateElectionPollType: (payload) => request(`/api/v1/user/election/update/poll-type`, { method: "PATCH", body: payload }),
  updateElectionCardId: (payload) => request(`/api/v1/user/election/update/card-id`, { method: "PATCH", body: payload }),
  updateElectionStart: (payload) => request(`/api/v1/user/election/update/start-time`, { method: "PATCH", body: payload }),
  updateElectionEnd: (payload) => request(`/api/v1/user/election/update/end-time`, { method: "PATCH", body: payload }),
  updateElectionVoters: (payload) => request(`/api/v1/user/election/update/voters`, { method: "PATCH", body: payload }),
  updateElectionOptions: (payload) => request(`/api/v1/user/election/update/options`, { method: "PATCH", body: payload }),
  updateElectionIsOpen: (payload) => request(`/api/v1/user/election/update/is-open`, { method: "PATCH", body: payload }),

  // Public
  castVote: (payload) => request(`/api/v1/public/vote/cast`, { method: "PUT", body: payload, auth: false }),
  castMultiVote: (payload) => request(`/api/v1/public/vote/cast/multi`, { method: "PUT", body: payload, auth: false }),
  // Open election (public)
  findOpenElection: ({ electionId }) => request(`/api/v1/election/find/open?electionId=${encodeURIComponent(electionId)}`, { method: "GET", auth: false }),
  castOpenVote: (payload) => request(`/api/v1/public/vote/open/cast`, { method: "PUT", body: payload, auth: false }),
  castOpenMultiVote: (payload) => request(`/api/v1/public/vote/open/cast/multi`, { method: "PUT", body: payload, auth: false }),
  // Public open election results
  openElectionResult: ({ electionId }) => request(`/api/v1/election/open/result?electionId=${encodeURIComponent(electionId)}`, { method: "GET", auth: false }),
  health: () => request(`/api/v1/public/health-check`, { method: "GET" }),
    // Per docs: voter-facing find endpoint is public under /api/v1/election/find/voter
    findElectionForVoter: ({ electionId, voterId }) =>
      request(`/api/v1/election/find/voter?electionId=${encodeURIComponent(electionId)}&voterId=${encodeURIComponent(voterId)}`,
        { method: "GET", auth: false }),
};

export function setAuthSession({ jwt, refreshToken, userInfo }) {
  if (jwt) storage.set(TOKEN_KEYS.jwt, jwt);
  if (refreshToken) storage.set(TOKEN_KEYS.refresh, refreshToken);
  if (userInfo) storage.set(TOKEN_KEYS.user, userInfo);
  if (jwt) scheduleRefreshFromJwt(jwt);
}

export function clearAuthSession() {
  storage.remove(TOKEN_KEYS.jwt);
  storage.remove(TOKEN_KEYS.refresh);
  storage.remove(TOKEN_KEYS.user);
  clearRefreshTimer();
}

// Initialize scheduling on app boot if a token already exists
export function initializeAuthScheduling() {
  const jwt = storage.get(TOKEN_KEYS.jwt);
  if (jwt) scheduleRefreshFromJwt(jwt);
}
