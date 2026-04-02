"use client";

import Image from "next/image";
import { useState } from "react";
import { Producto } from "@/data/productos";
import { useCarrito } from "@/context/CarritoContext";

interface MenuCardProps {
  producto: Producto;
  adminLogueado?: boolean;
  usuarioLogueado?: boolean;
  onLoginRequired?: () => void;
  onEditar?: (producto: Producto) => void;
}

export default function MenuCard({ producto, adminLogueado = false, usuarioLogueado = false, onLoginRequired, onEditar }: MenuCardProps) {
  const { agregarProducto } = useCarrito();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAgregar = () => {
    if (usuarioLogueado || adminLogueado) {
      agregarProducto(producto);
    } else if (onLoginRequired) {
      onLoginRequired();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-theme-100">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => setModalOpen(true)}
          />
          <div className="absolute top-3 right-3 bg-theme-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {producto.categoria}
          </div>
          {adminLogueado && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditar) onEditar(producto);
              }}
              className="absolute top-3 left-3 w-8 h-8 bg-gray-800/70 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-5">
          <h3 
            className="text-lg font-bold text-gray-900 mb-2 group-hover:text-theme-600 transition-colors cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            {producto.nombre}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-theme-600">
              {formatPrice(producto.precio)}
            </span>
            <button
              onClick={handleAgregar}
              className="bg-theme-500 hover:bg-theme-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles del producto */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen grande */}
            <div className="relative h-80 w-full bg-gray-100">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 512px"
                quality={90}
              />
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute top-3 left-3 bg-theme-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                {producto.categoria}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {producto.nombre}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {producto.descripcion}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-theme-600">
                  {formatPrice(producto.precio)}
                </span>
                <button
                  onClick={() => {
                    agregarProducto(producto);
                    setModalOpen(false);
                  }}
                  className="bg-theme-500 hover:bg-theme-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}