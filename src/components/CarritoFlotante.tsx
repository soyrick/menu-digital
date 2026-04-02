"use client";

import { useState, useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";

export default function CarritoFlotante() {
  const { toggleCarrito, cantidadTotal } = useCarrito();
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    const admin = localStorage.getItem('adminLogueado');
    setUsuarioLogueado(!!usuario || admin === 'true');
  }, []);

  // No mostrar el botón si no hay items o si no hay sesión iniciada
  if (cantidadTotal === 0 || !usuarioLogueado) return null;

  return (
    <button
      onClick={toggleCarrito}
      className="fixed bottom-6 right-6 bg-theme-500 hover:bg-theme-600 text-white px-6 py-4 rounded-full shadow-xl z-30 flex items-center gap-3 transition-all duration-200 hover:scale-105 active:scale-95 animate-bounce-subtle"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-white text-theme-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {cantidadTotal}
        </span>
      </div>
      <span className="font-bold">Ver Carrito</span>
    </button>
  );
}