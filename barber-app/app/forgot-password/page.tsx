"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Reset your password</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        We&apos;ll send a reset link to your email.
      </p>
      <Card className="mt-6">
        <CardBody>
          {sent ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Email">
                <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
      <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/login" className="font-medium underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
