"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await register(name, email, phone, password);
    setLoading(false);
    if (result.ok) router.push("/appointments");
    else setError(result.error ?? "Something went wrong.");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Create an account</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Track your appointment history and get access to special discounts.
      </p>
      <Card className="mt-6">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Email">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Phone">
              <TextInput type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Field>
            <Field label="Password">
              <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
        </CardBody>
      </Card>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
