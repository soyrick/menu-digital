"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SiteConfig {
  nombre: string;
  eslogan: string;
  direccion: string;
  headerColor: string;
  headerImagen: string | null;
  themeColor: string;
  backgroundColor: string | null;
  useBackgroundColor: boolean;
  pageTitle: string;
}

interface SiteConfigContextType {
  config: SiteConfig;
  actualizarConfig: (nuevaConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  isLoaded: boolean;
}

const defaultConfig: SiteConfig = {
  nombre: "Burger House",
  eslogan: "Las mejores hamburgusas de la ciudad",
  direccion: "Av. Principal 123, Centro",
  headerColor: "#ea580c",
  headerImagen: null,
  themeColor: "#ea580c",
  backgroundColor: null,
  useBackgroundColor: false,
  pageTitle: "Menú Digital | Restaurante",
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("siteConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig({
          ...defaultConfig,
          ...parsed,
        });
      } catch {
        setConfig(defaultConfig);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("siteConfig", JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const actualizarConfig = (nuevaConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...nuevaConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("siteConfig");
  };

  return (
    <SiteConfigContext.Provider value={{ config, actualizarConfig, resetConfig, isLoaded }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
}