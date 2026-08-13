"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "./types";
import { api, ApiError, setToken } from "./api";

const SESSION_KEY = "barber_app_session";

const listeners = new Set<() => void>();

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function setSession(user: AuthUser | null) {
  if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l());
}

type Status = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: Status;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Session lives in localStorage, which isn't available during SSR/hydration,
  // so we start in "loading" and only resolve to authenticated/unauthenticated
  // after mount — otherwise a protected route can briefly read "unauthenticated"
  // on first paint and redirect away before localStorage has been checked.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const sync = () => {
      const session = readSession();
      setUser(session);
      setStatus(session ? "authenticated" : "unauthenticated");
    };
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/api/auth/login", { email: email.trim(), password });
      setToken(res.token);
      setSession(res.user);
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { ok: false, error: err.status === 401 ? "Incorrect email or password." : err.message };
      }
      return { ok: false, error: "Could not reach the server. Please try again." };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await api.post<{ token: string; user: AuthUser }>("/api/auth/register", {
        name,
        email: email.trim(),
        phone,
        password,
      });
      setToken(res.token);
      setSession(res.user);
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { ok: false, error: err.status === 409 ? "An account with that email already exists." : err.message };
      }
      return { ok: false, error: "Could not reach the server. Please try again." };
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, register, signOut }),
    [user, status, signIn, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
