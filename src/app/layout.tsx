import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/context/CarritoContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Menú Digital | Restaurante",
  description: "Haz tu pedido fácil y rápido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-gradient-to-b from-orange-50 to-white font-sans">
        <AdminProvider>
          <ProductsProvider>
            <CarritoProvider>
              <SiteConfigProvider>
                {children}
              </SiteConfigProvider>
            </CarritoProvider>
          </ProductsProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
