"use client";

import { useState, useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { useAdmin } from "@/context/AdminContext";
import CarritoItem from "./CarritoItem";

interface CarritoProps {
  numeroWhatsApp: string;
}

export default function Carrito({ numeroWhatsApp }: CarritoProps) {
  const { items, total, vaciarCarrito, isOpen, toggleCarrito, cantidadTotal } = useCarrito();
  const { agregarPedido } = useAdmin();
  
  // Cargar datos del usuario desde localStorage
  const [usuarioGuardado, setUsuarioGuardado] = useState<any>({});
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nota, setNota] = useState("");
  const [tipoDireccion, setTipoDireccion] = useState<'predeterminada' | 'nueva'>('predeterminada');
  const [esRegalo, setEsRegalo] = useState(false);
  const [nombreRemitente, setNombreRemitente] = useState("");
  const [mensajeRegalo, setMensajeRegalo] = useState("");
  const [nombreOriginal, setNombreOriginal] = useState("");

  // Cargar datos del usuario al abrir el carrito
  useEffect(() => {
    if (isOpen) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const usuarioData = JSON.parse(usuario);
        setUsuarioGuardado(usuarioData);
        if (usuarioData.name) {
          setNombre(usuarioData.name);
          setNombreOriginal(usuarioData.name); // Guardar nombre original
        }
      }
    }
  }, [isOpen]);

  const direccionPredeterminada = usuarioGuardado.direccion || "";
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const construirMensaje = () => {
    const direccionFinal = tipoDireccion === 'predeterminada' ? direccionPredeterminada : direccion;
    
    let mensaje = "🛒 *Nuevo Pedido*\n\n";
    mensaje += "*Items:*\n";
    items.forEach((item) => {
      const subtotal = item.producto.precio * item.cantidad;
      mensaje += `• ${item.cantidad}x ${item.producto.nombre} (${formatPrice(subtotal)})\n`;
    });
    mensaje += `\n*Total: ${formatPrice(total)}*\n\n`;
    
    if (esRegalo) {
      mensaje += "🎁 *PEDIDO COMO REGALO*\n";
      if (nombreRemitente.trim()) mensaje += `🎅 *De:* ${nombreRemitente}\n`;
      if (nombre.trim()) mensaje += `🎁 *Para:* ${nombre}\n`;
      if (direccionFinal.trim()) mensaje += `📍 *Dirección de entrega:* ${direccionFinal}\n`;
      if (mensajeRegalo.trim()) mensaje += `💌 *Mensaje:* ${mensajeRegalo}\n`;
    } else {
      if (nombre.trim()) mensaje += `👤 *Nombre:* ${nombre}\n`;
      if (direccionFinal.trim()) mensaje += `📍 *Dirección:* ${direccionFinal}\n`;
    }
    
    if (nota.trim()) mensaje += `📝 *Nota:* ${nota}`;
    return mensaje;
  };

  const enviarWhatsApp = () => {
    if (items.length === 0) return;
    
    // Guardar el pedido en el contexto de admin
    const direccionFinal = tipoDireccion === 'predeterminada' ? direccionPredeterminada : direccion;
    agregarPedido({
      items: items.map(item => ({
        producto: {
          id: item.producto.id,
          nombre: item.producto.nombre,
          precio: item.producto.precio,
        },
        cantidad: item.cantidad,
      })),
      total,
      nombre: nombre || "Cliente",
      direccion: direccionFinal,
      nota,
      telefono: numeroWhatsApp,
      esRegalo,
      nombreRemitente: esRegalo ? nombreRemitente : undefined,
      mensajeRegalo: esRegalo ? mensajeRegalo : undefined,
    });
    
    // Enviar mensaje por WhatsApp
    const mensajeEncoded = encodeURIComponent(construirMensaje());
    const numeroLimpio = numeroWhatsApp.replace(/\D/g, "");
    window.open(`https://wa.me/${numeroLimpio}?text=${mensajeEncoded}`, "_blank");
    
    // Vaciar el carrito después de enviar
    vaciarCarrito();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={toggleCarrito}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">🛒 Tu Pedido</h2>
            <p className="text-xs text-gray-500">{cantidadTotal} items</p>
          </div>
          <button 
            onClick={toggleCarrito}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">Agrega productos del menú</p>
            </div>
          ) : (
            items.map((item) => (
              <CarritoItem key={item.producto.id} item={item} />
            ))
          )}
        </div>

        {/* Footer con datos y total */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-2 bg-gray-50 space-y-1">
            {/* Datos del cliente */}
            <div className="space-y-1">
              {/* Nombre del usuario (solo lectura) - solo si NO es regalo */}
              {!esRegalo && (
                <>
                  {nombre ? (
                    <div className="bg-theme-50 border border-theme-200 rounded px-2 py-1 text-xs font-medium text-theme-700">
                      👤 {nombre}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-theme-500 focus:ring-1 focus:ring-theme-200 outline-none transition-all text-xs"
                    />
                  )}
                </>
              )}
              
              {/* Opciones de dirección - solo si NO es regalo */}
              {!esRegalo && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTipoDireccion('predeterminada')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      tipoDireccion === 'predeterminada'
                        ? 'bg-theme-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📍 Predeterminada
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoDireccion('nueva')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      tipoDireccion === 'nueva'
                        ? 'bg-theme-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🆕 Nueva
                  </button>
                </div>
              )}

              {/* Input de nueva dirección (solo si selecciona nueva dirección y no es regalo) */}
              {tipoDireccion === 'nueva' && !esRegalo && (
                <input
                  type="text"
                  placeholder="Tu dirección actual"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-theme-500 focus:ring-1 focus:ring-theme-200 outline-none transition-all text-xs"
                />
              )}
              {/* Dirección predeterminada (solo si selecciona predeterminada y no es regalo) */}
              {tipoDireccion === 'predeterminada' && !esRegalo && (
                direccionPredeterminada ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-1.5 text-xs text-green-700">
                    📍 {direccionPredeterminada}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1.5 text-xs text-yellow-700">
                    ⚠️ Sin dirección. Usa "Nueva"
                  </div>
                )
              )}
              
              {/* Modo regalo - campos adicionales */}
              {esRegalo && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-purple-600">🎁 Regalo</p>
                  <input
                    type="text"
                    placeholder="Remitente"
                    value={nombreRemitente}
                    onChange={(e) => setNombreRemitente(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Destinatario"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dirección de entrega"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all text-xs"
                  />
                  <textarea
                    placeholder="Mensaje"
                    value={mensajeRegalo}
                    onChange={(e) => setMensajeRegalo(e.target.value)}
                    rows={1}
                    className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all resize-none text-xs"
                  />
                </div>
              )}
              
              <textarea
                placeholder="Nota (opcional)"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={1}
                className="w-full px-2 py-1 rounded-lg border border-gray-200 focus:border-theme-500 focus:ring-1 focus:ring-theme-200 outline-none transition-all resize-none text-xs"
              />
              
              {/* Botón de regalo */}
              <button
                type="button"
                onClick={() => {
                  if (esRegalo) {
                    // Cancelar modo regalo - restaurar nombre original
                    setNombre(nombreOriginal);
                    setDireccion(direccionPredeterminada);
                    setNombreRemitente("");
                    setMensajeRegalo("");
                  } else {
                    // Activar modo regalo - limpiar campos
                    setNombre("");
                    setDireccion("");
                    setNombreRemitente(usuarioGuardado.name || "");
                    setMensajeRegalo("");
                  }
                  setEsRegalo(!esRegalo);
                }}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  esRegalo 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                <span>🎁</span>
                {esRegalo ? "Cancelar regalo" : "Hacer regalo"}
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Total</span>
              <span className="text-xl font-bold text-theme-600">
                {formatPrice(total)}
              </span>
            </div>

            {/* Botones */}
            <div className="space-y-2">
              <button
                onClick={enviarWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.886 1.824 5.149l1.657-1.658-.063-.133-.074-.143z"/>
                </svg>
                Enviar a WhatsApp
              </button>
              <button
                onClick={vaciarCarrito}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}