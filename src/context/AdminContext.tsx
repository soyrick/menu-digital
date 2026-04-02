"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Pedido {
  id: string;
  fecha: string;
  items: {
    producto: {
      id: string;
      nombre: string;
      precio: number;
    };
    cantidad: number;
  }[];
  total: number;
  nombre: string;
  direccion: string;
  nota: string;
  telefono: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
}

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  pedidos: Pedido[];
  agregarPedido: (pedido: Omit<Pedido, 'id' | 'fecha' | 'estado'>) => void;
  actualizarEstadoPedido: (id: string, estado: Pedido['estado']) => void;
  productosVendidos: Map<string, number>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Credencial de admin (en producción esto debería validarse en el servidor)
const ADMIN_PASSWORD = "admin123";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Cargar pedidos desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pedidos");
    if (saved) {
      try {
        setPedidos(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing pedidos:", e);
      }
    }
  }, []);

  // Guardar pedidos en localStorage
  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLogueado');
    }
  };

  const agregarPedido = (pedido: Omit<Pedido, 'id' | 'fecha' | 'estado'>) => {
    const nuevoPedido: Pedido = {
      ...pedido,
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    };
    setPedidos((prev) => [nuevoPedido, ...prev]);
  };

  const actualizarEstadoPedido = (id: string, estado: Pedido['estado']) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p))
    );
  };

  // Calcular productos vendidos
  const productosVendidos = pedidos.reduce((acc, pedido) => {
    pedido.items.forEach((item) => {
      const actual = acc.get(item.producto.nombre) || 0;
      acc.set(item.producto.nombre, actual + item.cantidad);
    });
    return acc;
  }, new Map<string, number>());

  // Calcular ingresos totales
  const ingresosTotales = pedidos.reduce((acc, pedido) => {
    return acc + pedido.total;
  }, 0);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        pedidos,
        agregarPedido,
        actualizarEstadoPedido,
        productosVendidos,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}