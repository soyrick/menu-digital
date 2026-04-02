"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ItemCarrito {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
  };
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregarProducto: (producto: ItemCarrito["producto"]) => void;
  eliminarProducto: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  total: number;
  cantidadTotal: number;
  toggleCarrito: () => void;
  abrirCarrito: () => void;
  isOpen: boolean;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }, []);

  // Escuchar cambios en la autenticación y limpiar el carrito si no hay sesión
  useEffect(() => {
    const checkAuthAndClearCart = () => {
      const usuario = localStorage.getItem('usuario');
      const admin = localStorage.getItem('adminLogueado');
      const isLoggedIn = !!usuario || admin === 'true';
      
      // Si no hay sesión, vaciar el carrito
      if (!isLoggedIn && items.length > 0) {
        setItems([]);
        localStorage.removeItem("carrito");
      }
    };

    // Verificar al inicio
    checkAuthAndClearCart();

    // Escuchar cambios
    window.addEventListener('storage', checkAuthAndClearCart);
    
    // También verificar periódicamente (para detectar cierre de sesión sin refresh)
    const interval = setInterval(checkAuthAndClearCart, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAuthAndClearCart);
      clearInterval(interval);
    };
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const agregarProducto = (producto: ItemCarrito["producto"]) => {
    setItems((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const eliminarProducto = (productoId: string) => {
    setItems((prev) => prev.filter((item) => item.producto.id !== productoId));
  };

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const toggleCarrito = () => {
    setIsOpen((prev) => !prev);
  };

  const abrirCarrito = () => {
    setIsOpen(true);
  };

  const total = items.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarProducto,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito,
        total,
        cantidadTotal,
        toggleCarrito,
        abrirCarrito,
        isOpen,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito must be used within a CarritoProvider");
  }
  return context;
}