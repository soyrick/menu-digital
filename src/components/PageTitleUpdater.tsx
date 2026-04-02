"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";
import { useEffect } from "react";

export default function PageTitleUpdater() {
  const { config, isLoaded } = useSiteConfig();

  useEffect(() => {
    // Solo actualizar cuando esté cargado y tenga un título personalizado
    if (isLoaded && config.pageTitle && config.pageTitle !== "Menú Digital | Restaurante") {
      document.title = config.pageTitle;
    }
  }, [config.pageTitle, isLoaded]);

  // No renderizar nada hasta que esté cargado
  if (!isLoaded) {
    return null;
  }

  return null;
}