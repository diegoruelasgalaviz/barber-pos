"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { AuthUser, Role } from "./types";
import { api, ApiError, setToken } from "./api";

const SESSION_KEY = "barber_admin_session";

// A tiny external store backing the mocked session so we can read it via
// useSyncExternalStore (avoids a setState-in-effect on mount and keeps
// server/client hydration in sync automatically).
let sessionCache: AuthUser | null | undefined;
const listeners = new Set<() => void>();

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function getSnapshot(): AuthUser | null {
  if (sessionCache === undefined) sessionCache = readSession();
  return sessionCache;
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function setSession(user: AuthUser | null) {
  sessionCache = user;
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l());
}

interface AuthContextValue {
  user: AuthUser | null;
  status: "authenticated" | "unauthenticated";
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const status: AuthContextValue["status"] = user ? "authenticated" : "unauthenticated";

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.post<{ token: string; user: Omit<AuthUser, "role"> & { role: Role | "customer" } }>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      if (res.user.role === "customer") {
        return { ok: false, error: "This account doesn't have admin access." };
      }
      setToken(res.token);
      setSession(res.user as AuthUser);
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { ok: false, error: err.status === 401 ? "Incorrect email or password." : err.message };
      }
      return { ok: false, error: "Could not reach the server. Please try again." };
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setSession(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    // No dedicated reset-email flow on the backend yet; mimic a real
    // backend's response without leaking whether the account exists.
    void email;
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true };
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, status, signIn, signOut, requestPasswordReset, hasRole }),
    [user, status, signIn, signOut, requestPasswordReset, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
