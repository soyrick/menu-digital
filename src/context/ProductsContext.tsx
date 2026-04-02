"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Producto } from "@/data/productos";

const DEFAULT_CATEGORIAS = ["Hamburguesas", "Acompañamientos", "Bebidas", "Postres"];

interface ProductsContextType {
  productos: Producto[];
  agregarProducto: (producto: Omit<Producto, "id">) => void;
  actualizarProducto: (id: string, producto: Partial<Producto>) => void;
  eliminarProducto: (id: string) => void;
  categorias: string[];
  agregarCategoria: (categoria: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>(DEFAULT_CATEGORIAS);

  // Cargar productos y categorías desde localStorage
  useEffect(() => {
    // Cargar productos
    import("@/data/productos").then(({ productos: productosIniciales }) => {
      const saved = localStorage.getItem("productos");
      if (saved) {
        try {
          setProductos(JSON.parse(saved));
        } catch {
          setProductos(productosIniciales);
        }
      } else {
        setProductos(productosIniciales);
      }
    });

    // Cargar categorías
    const savedCategorias = localStorage.getItem("categorias");
    if (savedCategorias) {
      try {
        setCategorias(JSON.parse(savedCategorias));
      } catch {
        setCategorias(DEFAULT_CATEGORIAS);
      }
    }
  }, []);

  // Guardar productos en localStorage cuando cambie
  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem("productos", JSON.stringify(productos));
    }
  }, [productos]);

  // Guardar categorías en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const agregarProducto = (producto: Omit<Producto, "id">) => {
    const nuevoProducto: Producto = {
      ...producto,
      id: Date.now().toString(),
    };
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  const actualizarProducto = (id: string, productoActualizado: Partial<Producto>) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productoActualizado } : p))
    );
  };

  const eliminarProducto = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const agregarCategoria = (nuevaCategoria: string) => {
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
      setCategorias((prev) => [...prev, nuevaCategoria]);
    }
  };

  // Combinar "Todas" con las categorías personalizadas para el menú
  const categoriasMenu = ["Todas", ...categorias];

  return (
    <ProductsContext.Provider value={{ 
      productos, 
      agregarProducto, 
      actualizarProducto, 
      eliminarProducto, 
      categorias: categoriasMenu,
      agregarCategoria 
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}