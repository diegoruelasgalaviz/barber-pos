"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useCatalog } from "@/lib/catalog-context";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const { status } = useAuth();
  const { services: SERVICES, barbers: BARBERS } = useCatalog();

  return (
    <div>
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Book your next haircut in seconds.
          </h1>
          <p className="max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            Choose a barber, pick a time, and pay online or in the shop. No account needed — but sign up to
            track your appointments and unlock member discounts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/book">
              <Button size="lg">Book Now</Button>
            </Link>
            {status === "unauthenticated" && (
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Create an account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Popular Services</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((service) => (
            <Card key={service.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{service.name}</h3>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{service.description}</p>
                <p className="mt-2 text-xs text-zinc-400">{service.durationMinutes} min</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Our Barbers</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BARBERS.map((barber) => (
            <Card key={barber.id} className="text-center">
              <CardBody>
                <span
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
                  style={{ backgroundColor: barber.color }}
                >
                  {barber.photoInitials}
                </span>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">{barber.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{barber.title}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
