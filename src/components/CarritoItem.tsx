"use client";

import Image from "next/image";
import { ItemCarrito } from "@/context/CarritoContext";
import { useCarrito } from "@/context/CarritoContext";

interface CarritoItemProps {
  item: ItemCarrito;
}

export default function CarritoItem({ item }: CarritoItemProps) {
  const { actualizarCantidad, eliminarProducto } = useCarrito();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = item.producto.precio * item.cantidad;

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={item.producto.imagen}
          alt={item.producto.nombre}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">
          {item.producto.nombre}
        </h4>
        <p className="text-orange-600 font-bold text-sm">
          {formatPrice(item.producto.precio)}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm transition-colors"
          >
            -
          </button>
          <span className="text-sm font-medium text-gray-900 w-6 text-center">
            {item.cantidad}
          </span>
          <button
            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm transition-colors"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => eliminarProducto(item.producto.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="font-bold text-gray-900 text-sm">
          {formatPrice(subtotal)}
        </span>
      </div>
    </div>
  );
}