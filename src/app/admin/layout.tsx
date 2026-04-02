import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/Providers";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Administración",
  description: "Panel de administración",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}