"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "./types";
import { MOCK_USERS } from "./mock-data";

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
    await new Promise((r) => setTimeout(r, 400));
    const match = MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!match) return { ok: false, error: "No account found with that email." };
    if (match.password !== password) return { ok: false, error: "Incorrect password." };
    const { password: _pw, ...publicUser } = match;
    void _pw;
    setSession(publicUser);
    return { ok: true };
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const newUser: AuthUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      phone,
      avatarColor: "#0ea5e9",
    };
    MOCK_USERS.push({ ...newUser, password });
    setSession(newUser);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => setSession(null), []);

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
