"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin, Pedido } from "@/context/AdminContext";
import { useProducts } from "@/context/ProductsContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, logout } = useAdmin();
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    // Verificar si el admin está logueado en localStorage
    const adminLocal = localStorage.getItem('adminLogueado');
    if (adminLocal === 'true') {
      setLogueado(true);
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (!logueado && !isAdmin) {
    return null;
  }

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const { pedidos, productosVendidos, logout, actualizarEstadoPedido } = useAdmin();
  const { agregarProducto, categorias, agregarCategoria } = useProducts();
  const { config } = useSiteConfig();
  const [vistaActiva, setVistaActiva] = useState<"pedidos" | "productos" | "agregar">("pedidos");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: "", categoria: "Hamburguesas" });
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const router = useRouter();

  // Obtener categorías reales (sin "Todas") - se calcula cada render
  const categoriasBase = categorias.filter(c => c !== "Todas");

  // Usar las categorías base para el select
  const categoriasParaSelect = categoriasBase.length > 0 ? categoriasBase : ["Hamburguesas", "Acompañamientos", "Bebidas", "Postres"];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-CL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre && formData.precio && imagenPreview) {
      agregarProducto({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagen: imagenPreview,
      });
      setShowSuccess(true);
      setFormData({ nombre: "", descripcion: "", precio: "", categoria: "Hamburguesas" });
      setImagenPreview(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ingresosTotales = pedidos.reduce((acc, p) => acc + p.total, 0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminLogueado');
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header 
        className="text-white py-6 px-6 relative"
        style={{
          backgroundImage: config.headerImagen ? `url(${config.headerImagen})` : undefined,
          backgroundColor: config.headerImagen ? 'transparent' : (config.headerColor || '#ea580c'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {config.headerImagen && <div className="absolute inset-0 bg-black/40" />}
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-orange-100 text-sm">{config.nombre}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Pedidos Totales</p>
          <p className="text-3xl font-bold text-gray-900">{pedidos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
          <p className="text-3xl font-bold text-green-600">{formatPrice(ingresosTotales)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Productos Vendidos</p>
          <p className="text-3xl font-bold text-orange-600">
            {Array.from(productosVendidos.values()).reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVistaActiva("pedidos")}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
              vistaActiva === "pedidos" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-100"
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setVistaActiva("productos")}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
              vistaActiva === "productos" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-100"
            }`}
          >
            Productos Más Vendidos
          </button>
          <button
            onClick={() => setVistaActiva("agregar")}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
              vistaActiva === "agregar" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-100"
            }`}
          >
            Agregar Producto
          </button>
        </div>

        {vistaActiva === "pedidos" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Fecha</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cliente</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Teléfono</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Items</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No hay pedidos aún</td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(pedido.fecha)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{pedido.nombre || "No especificado"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{pedido.telefono}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pedido.items.map((item) => (
                            <div key={item.producto.id}>{item.cantidad}x {item.producto.nombre}</div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">{formatPrice(pedido.total)}</td>
                        <td className="px-6 py-4">
                          <select
                            value={pedido.estado}
                            onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value as Pedido['estado'])}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer border-0 ${
                              pedido.estado === "pendiente" ? "bg-yellow-100 text-yellow-700" :
                              pedido.estado === "confirmado" ? "bg-blue-100 text-blue-700" :
                              "bg-green-100 text-green-700"
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="entregado">Entregado</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vistaActiva === "productos" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Producto</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Cantidad Vendida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from(productosVendidos.entries()).length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500">No hay ventas aún</td>
                  </tr>
                ) : (
                  Array.from(productosVendidos.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([nombre, cantidad]) => (
                      <tr key={nombre} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{nombre}</td>
                        <td className="px-6 py-4 text-sm font-medium text-orange-600 text-right">{cantidad}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {vistaActiva === "agregar" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Agregar Nuevo Producto</h2>
            <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" 
                  placeholder="Ej: Hamburguesa Clásica" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  rows={3} 
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" 
                  placeholder="Descripción del producto..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input 
                    type="number" 
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" 
                    placeholder="5000" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  {showNuevaCategoria ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        placeholder="Nombre de la categoría"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (nuevaCategoria.trim()) {
                            agregarCategoria(nuevaCategoria.trim());
                            setFormData({ ...formData, categoria: nuevaCategoria.trim() });
                            setNuevaCategoria("");
                            setShowNuevaCategoria(false);
                          }
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                      >
                        Agregar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNuevaCategoria(false);
                          setNuevaCategoria("");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      >
                        {categoriasParaSelect.map((cat: string) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNuevaCategoria(true)}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-xl font-bold transition-colors"
                        title="Agregar nueva categoría"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                {imagenPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagenPreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagenPreview(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Haz click para seleccionar una imagen</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG o WebP</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all">
                Agregar Producto
              </button>
            </form>
            
            {/* Mensaje de éxito */}
            {showSuccess && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Producto Agregado!</h3>
                  <p className="text-gray-500">El producto ya está disponible en el menú</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}