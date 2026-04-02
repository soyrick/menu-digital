"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SiteConfig {
  nombre: string;
  eslogan: string;
  direccion: string;
  headerColor: string;
  headerImagen: string | null;
}

interface SiteConfigContextType {
  config: SiteConfig;
  actualizarConfig: (nuevaConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: SiteConfig = {
  nombre: "Burger House",
  eslogan: "Las mejores hamburgusas de la ciudad",
  direccion: "Av. Principal 123, Centro",
  headerColor: "#ea580c",
  headerImagen: null,
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    const saved = localStorage.getItem("siteConfig");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {
        setConfig(defaultConfig);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("siteConfig", JSON.stringify(config));
  }, [config]);

  const actualizarConfig = (nuevaConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...nuevaConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem("siteConfig");
  };

  return (
    <SiteConfigContext.Provider value={{ config, actualizarConfig, resetConfig }}>
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