// Simple token storage helpers using localStorage
export const storage = {
  get(key) {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch {
      return window.localStorage.getItem(key);
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    const v = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, v);
  },
  remove(key) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};

export const TOKEN_KEYS = {
  jwt: "bg_jwt",
  refresh: "bg_refresh",
  user: "bg_user",
  lastElection: "bg_last_election",
};
