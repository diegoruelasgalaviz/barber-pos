"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("jordan@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.ok) router.push("/appointments");
    else setError(result.error ?? "Something went wrong.");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Log in</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Access your appointments and member discounts.
      </p>
      <Card className="mt-6">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Password">
              <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Log in"}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/forgot-password" className="underline">
              Forgot password?
            </Link>
            <Link href="/register" className="underline">
              Create an account
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Demo account pre-filled: jordan@example.com / password123
          </p>
        </CardBody>
      </Card>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t want an account?{" "}
        <Link href="/book" className="font-medium underline">
          Book as a guest
        </Link>
      </p>
    </div>
  );
}
