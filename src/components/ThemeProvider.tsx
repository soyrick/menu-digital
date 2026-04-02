"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";
import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { config, isLoaded } = useSiteConfig();

  // No renderizar hasta que esté cargado (evita el flash)
  if (!isLoaded) {
    return null;
  }

  // Convertir el color hex a valores RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  const themeColor = config.themeColor || config.headerColor;
  const backgroundColor = config.useBackgroundColor && config.backgroundColor 
    ? config.backgroundColor 
    : null;
  const rgb = hexToRgb(themeColor) || { r: 234, g: 88, b: 12 };
  
  // Generar colores derivados para el tema
  const color50 = `rgb(${Math.round(rgb.r * 0.95 + 255 * 0.05)}, ${Math.round(rgb.g * 0.95 + 255 * 0.05)}, ${Math.round(rgb.b * 0.95 + 255 * 0.05)})`;
  const color100 = `rgb(${Math.round(rgb.r * 0.9 + 255 * 0.1)}, ${Math.round(rgb.g * 0.9 + 255 * 0.1)}, ${Math.round(rgb.b * 0.9 + 255 * 0.1)})`;
  const color200 = `rgb(${Math.round(rgb.r * 0.8 + 255 * 0.2)}, ${Math.round(rgb.g * 0.8 + 255 * 0.2)}, ${Math.round(rgb.b * 0.8 + 255 * 0.2)})`;
  const color300 = `rgb(${Math.round(rgb.r * 0.7 + 255 * 0.3)}, ${Math.round(rgb.g * 0.7 + 255 * 0.3)}, ${Math.round(rgb.b * 0.7 + 255 * 0.3)})`;
  const color400 = `rgb(${Math.round(rgb.r * 0.6 + 255 * 0.4)}, ${Math.round(rgb.g * 0.6 + 255 * 0.4)}, ${Math.round(rgb.b * 0.6 + 255 * 0.4)})`;
  const color500 = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const color600 = `rgb(${Math.round(rgb.r * 0.8)}, ${Math.round(rgb.g * 0.8)}, ${Math.round(rgb.b * 0.8)})`;
  const color700 = `rgb(${Math.round(rgb.r * 0.6)}, ${Math.round(rgb.g * 0.6)}, ${Math.round(rgb.b * 0.6)})`;

  // Fondo: usar backgroundColor si está seleccionado, sino el gradiente del tema
  const bgValue = backgroundColor 
    ? backgroundColor 
    : color50;
  const gradientFrom = bgValue;
  const gradientTo = "#ffffff";

  const style = {
    "--theme-50": color50,
    "--theme-100": color100,
    "--theme-200": color200,
    "--theme-300": color300,
    "--theme-400": color400,
    "--theme-500": color500,
    "--theme-600": color600,
    "--theme-700": color700,
    background: backgroundColor 
      ? backgroundColor 
      : `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  } as React.CSSProperties & Record<string, string>;

  return (
    <div 
      style={style}
      className="min-h-screen flex flex-col"
    >
      {children}
    </div>
  );
}