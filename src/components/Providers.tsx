"use client";

import { ReactNode } from "react";
import { AdminProvider } from "@/context/AdminContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { CarritoProvider } from "@/context/CarritoContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <ProductsProvider>
        <CarritoProvider>
          <SiteConfigProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SiteConfigProvider>
        </CarritoProvider>
      </ProductsProvider>
    </AdminProvider>
  );
}