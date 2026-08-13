import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { BookingProvider } from "@/lib/booking-context";
import { CatalogProvider } from "@/lib/catalog-context";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Faded Lines Barbershop — Book an Appointment",
  description: "Book a haircut appointment online, with or without an account.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <AuthProvider>
          <CatalogProvider>
            <BookingProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
            </BookingProvider>
          </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
