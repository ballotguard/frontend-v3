"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthSession, clearAuthSession, initializeAuthScheduling } from "../lib/api";
import { storage, TOKEN_KEYS } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const token = storage.get(TOKEN_KEYS.jwt);
        if (token) {
          initializeAuthScheduling();
          const data = await api.getUser();
          if (data?.userInfo) {
            setUser(data.userInfo);
            // Save user data to localStorage from API response
            const userData = {
              name: data.userInfo.name || `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim(),
              firstName: data.userInfo.firstName,
              lastName: data.userInfo.lastName,
              email: data.userInfo.email
            };
            storage.set(TOKEN_KEYS.user, userData);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    async verifyAndRefreshSession() {
      // Attempt a refresh if possible; then fetch user to validate session
      try {
        await api.refreshAuth?.();
        const data = await api.getUser();
        if (data?.userInfo) {
          setUser(data.userInfo);
          // Save user data to localStorage from API response
          const userData = {
            name: data.userInfo.name || `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim(),
            firstName: data.userInfo.firstName,
            lastName: data.userInfo.lastName,
            email: data.userInfo.email
          };
          storage.set(TOKEN_KEYS.user, userData);
        }
        return !!data?.userInfo;
      } catch {
        return false;
      }
    },
    async login(email, password) {
      const data = await api.login({ email, password });
      setAuthSession(data);
      setUser(data.userInfo);
      // Save user data to localStorage from API response
      if (data.userInfo) {
        const userData = {
          name: data.userInfo.name || `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim(),
          firstName: data.userInfo.firstName,
          lastName: data.userInfo.lastName,
          email: data.userInfo.email
        };
        storage.set(TOKEN_KEYS.user, userData);
      }
      return data;
    },
    async signup(payload) {
      const data = await api.signup(payload);
      setAuthSession(data);
      setUser(data.userInfo);
      // Save user data to localStorage from API response
      if (data.userInfo) {
        const userData = {
          name: data.userInfo.name || `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim(),
          firstName: data.userInfo.firstName,
          lastName: data.userInfo.lastName,
          email: data.userInfo.email
        };
        storage.set(TOKEN_KEYS.user, userData);
      }
      return data;
    },
    async refreshUser() {
      const data = await api.getUser();
      if (data?.userInfo) {
        setUser(data.userInfo);
        // Save user data to localStorage from API response
        const userData = {
          name: data.userInfo.name || `${data.userInfo.firstName || ''} ${data.userInfo.lastName || ''}`.trim(),
          firstName: data.userInfo.firstName,
          lastName: data.userInfo.lastName,
          email: data.userInfo.email
        };
        storage.set(TOKEN_KEYS.user, userData);
      }
      return data;
    },
    logout() {
      clearAuthSession();
      setUser(null);
      // Clear user data from localStorage
      storage.remove(TOKEN_KEYS.user);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
