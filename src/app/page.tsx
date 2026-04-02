"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useAdmin } from "@/context/AdminContext";
import { useCarrito } from "@/context/CarritoContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import MenuCard from "@/components/MenuCard";
import Carrito from "@/components/Carrito";
import CarritoFlotante from "@/components/CarritoFlotante";
import LoginModal from "@/components/LoginModal";
import Toast from "@/components/Toast";
import { Producto } from "@/data/productos";

const NUMERO_WHATSAPP = "584121097114";

const COLORES = [
  { name: "Naranja", value: "#ea580c" },
  { name: "Rojo", value: "#dc2626" },
  { name: "Verde", value: "#16a34a" },
  { name: "Azul", value: "#2563eb" },
  { name: "Morado", value: "#9333ea" },
  { name: "Negro", value: "#1f2937" },
  { name: "Amarillo", value: "#ca8a04" },
  { name: "Rosa", value: "#db2777" },
  { name: "Gris", value: "#6b7280" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Blanco", value: "#ffffff" },
];

export default function Home() {
  const router = useRouter();
  const { abrirCarrito } = useCarrito();
  const { config, actualizarConfig } = useSiteConfig();
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminLogueado, setAdminLogueado] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showEditHeader, setShowEditHeader] = useState(false);
  const [headerImagePosition, setHeaderImagePosition] = useState(50);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [editForm, setEditForm] = useState({
    nombre: "",
    eslogan: "",
    direccion: "",
    headerColor: "#ea580c",
    headerImagen: null as string | null,
    themeColor: "#ea580c",
    backgroundColor: null as string | null,
    useBackgroundColor: false,
    pageTitle: "Menú Digital | Restaurante",
  });
  const { productos, categorias } = useProducts();
  const { isAdmin } = useAdmin();

  // Sincronizar editForm con config cuando se abre el modal
  useEffect(() => {
    if (showEditHeader) {
      setEditForm({
        nombre: config.nombre,
        eslogan: config.eslogan,
        direccion: config.direccion,
        headerColor: config.headerColor,
        headerImagen: config.headerImagen,
        themeColor: config.themeColor,
        backgroundColor: config.backgroundColor,
        useBackgroundColor: config.useBackgroundColor,
        pageTitle: config.pageTitle,
      });
    }
  }, [showEditHeader, config]);

  // Toast para mostrar mensajes
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    const checkAuth = () => {
      const admin = localStorage.getItem('adminLogueado');
      const usuario = localStorage.getItem('usuario');
      setAdminLogueado(admin === 'true');
      setUsuarioLogueado(!!usuario);
    };
    
    checkAuth();
    
    // Escuchar cambios en localStorage (para cuando se cierre sesión)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleGoToAdmin = () => {
    router.push("/admin");
  };

  const handleLoginSuccess = () => {
    setUsuarioLogueado(true);
    // Abrir el carrito después de un login exitoso
    abrirCarrito();
    showToastMessage("✅ Sesión iniciada");
  };

  const handleAdminLoginSuccess = () => {
    setAdminLogueado(true);
    showToastMessage("✅ Sesión de administrador iniciada");
  };

  const handleLogout = () => {
    showToastMessage("🔒 Sesión cerrada");
  };

  const handleAdminLogout = () => {
    showToastMessage("🔒 Sesión de administrador cerrada");
  };

  const productosFiltrados = categoriaActiva === "Todas"
    ? productos
    : productos.filter((p) => p.categoria === categoriaActiva);

  // Filtrar por búsqueda (busca tanto en nombre como en categoría)
  const productosMostrados = terminoBusqueda.trim()
    ? productosFiltrados.filter((p) => 
        p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
      )
    : productosFiltrados;

  return (
    <main className="flex-1 flex flex-col">
      {/* Header dinámico */}
      <header 
        className="bg-gradient-to-r text-white py-12 px-6 text-center relative"
        style={{
          backgroundImage: config.headerImagen 
            ? `url(${config.headerImagen})` 
            : undefined,
          backgroundColor: config.headerImagen ? 'transparent' : config.headerColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay para imagen de fondo */}
        {config.headerImagen && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        
        {/* Contenido del header */}
        <div className={`max-w-4xl mx-auto relative ${config.headerImagen ? 'text-white' : ''}`}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            {config.nombre}
          </h1>
          <p className="text-lg md:text-xl mb-4" style={{ color: config.headerImagen ? 'rgba(255,255,255,0.9)' : undefined }}>
            {config.eslogan}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: config.headerImagen ? 'rgba(255,255,255,0.8)' : undefined }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{config.direccion}</span>
          </div>
        </div>
        
        {/* Botón de edición para admin */}
        {adminLogueado && (
          <button
            onClick={() => {
              setShowEditHeader(true);
            }}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-2 transition-colors backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm font-medium">Editar</span>
          </button>
        )}
        
        <button
          onClick={adminLogueado ? handleGoToAdmin : () => setShowLoginModal(true)}
          className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors backdrop-blur-sm"
        >
          {adminLogueado ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Panel Admin</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </>
          )}
        </button>
      </header>

      {/* Modal de edición del header */}
      {showEditHeader && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Editar Header</h2>
              <button onClick={() => setShowEditHeader(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del lugar</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none"
                  placeholder="Nombre del restaurante"
                />
              </div>

              {/* Eslogan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eslogan</label>
                <input
                  type="text"
                  value={editForm.eslogan}
                  onChange={(e) => setEditForm({ ...editForm, eslogan: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none"
                  placeholder="Eslogan del negocio"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.direccion}
                  onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none"
                  placeholder="Dirección del negocio"
                />
              </div>

              {/* Título de la pestaña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de la pestaña</label>
                <input
                  type="text"
                  value={editForm.pageTitle}
                  onChange={(e) => setEditForm({ ...editForm, pageTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none"
                  placeholder="Título que aparece en la pestaña del navegador"
                />
              </div>

              {/* Opciones de fondo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fondo del header</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, headerImagen: null })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      !editForm.headerImagen 
                        ? 'bg-theme-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🎨 Color
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('headerImageInput')?.click()}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      editForm.headerImagen 
                        ? 'bg-theme-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🖼️ Imagen
                  </button>
                  <input
                    id="headerImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditForm({ ...editForm, headerImagen: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {/* Paleta de colores */}
                {!editForm.headerImagen && (
                  <div className="grid grid-cols-5 gap-2">
                    {COLORES.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, headerColor: color.value })}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          editForm.headerColor === color.value 
                            ? 'border-gray-900 scale-110' 
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}

                {/* Preview de imagen */}
                {editForm.headerImagen && (
                  <div className="relative">
                    <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src={editForm.headerImagen} 
                        alt="Header preview" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: `${headerImagePosition}% center` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={headerImagePosition}
                      onChange={(e) => setHeaderImagePosition(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">Ajustar posición de la imagen</p>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, headerImagen: null })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Color del tema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color del tema</label>
                <p className="text-xs text-gray-500 mb-3">Este color se aplica al fondo de la página</p>
                <div className="grid grid-cols-5 gap-2">
                  {COLORES.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, themeColor: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        editForm.themeColor === color.value 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Color de fondo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color de fondo</label>
                <p className="text-xs text-gray-500 mb-3">Color sólido para el fondo de la página</p>
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {COLORES.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditForm({ 
                          ...editForm, 
                          backgroundColor: color.value,
                          useBackgroundColor: true,
                        })}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          editForm.backgroundColor === color.value && editForm.useBackgroundColor
                            ? 'border-gray-900 scale-110' 
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditForm({ 
                      ...editForm, 
                      backgroundColor: null,
                      useBackgroundColor: false,
                    })}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      !editForm.useBackgroundColor
                        ? 'border-gray-900 scale-110 bg-gray-200' 
                        : 'border-gray-300 bg-white'
                    }`}
                    title="Usar color del tema"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditHeader(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  actualizarConfig({
                    nombre: editForm.nombre,
                    eslogan: editForm.eslogan,
                    direccion: editForm.direccion,
                    headerColor: editForm.headerColor,
                    headerImagen: editForm.headerImagen,
                    themeColor: editForm.themeColor,
                    backgroundColor: editForm.backgroundColor,
                    useBackgroundColor: editForm.useBackgroundColor,
                    pageTitle: editForm.pageTitle,
                  });
                  setShowEditHeader(false);
                  showToastMessage("✅ Header actualizado");
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-bold transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-2 min-w-max overflow-x-auto">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoriaActiva(cat);
                  setTerminoBusqueda("");
                }}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  categoriaActiva === cat
                    ? "bg-theme-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-theme-100 hover:text-theme-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative flex items-center gap-2">
            {busquedaActiva && (
              <div className="flex items-center gap-2 animate-slide-in-left">
                <div className="relative">
                  <input
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-48 md:w-64 px-4 py-2 pr-10 rounded-full border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                    autoFocus
                  />
                  {terminoBusqueda && (
                    <button
                      onClick={() => setTerminoBusqueda("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => setBusquedaActiva(!busquedaActiva)}
              className={`p-2.5 rounded-full transition-all ${
                busquedaActiva 
                  ? "bg-theme-500 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-theme-100 hover:text-theme-700"
              }`}
              title="Buscar productos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {terminoBusqueda 
              ? `Resultados para "${terminoBusqueda}"` 
              : categoriaActiva === "Todas" ? "Todo el Menú" : categoriaActiva}
          </h2>
          <span className="text-gray-500 text-sm">
            {productosMostrados.length} productos
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosMostrados.map((producto) => (
            <MenuCard 
              key={producto.id} 
              producto={producto} 
              adminLogueado={adminLogueado}
              usuarioLogueado={usuarioLogueado}
              onLoginRequired={() => setShowLoginModal(true)}
              onEditar={(p) => setProductoEditar(p)}
            />
          ))}
        </div>

        {productosMostrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {terminoBusqueda 
                ? `No se encontraron productos para "${terminoBusqueda}"` 
                : "No hay productos en esta categoría"}
            </p>
            {terminoBusqueda && (
              <button
                onClick={() => setTerminoBusqueda("")}
                className="mt-4 text-theme-500 hover:text-theme-600 font-medium"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center mt-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm">© 2026 Burger House. Todos los derechos reservados.</p>
          <p className="text-xs mt-2">Haz tu pedido y te lo llevamos a casa</p>
        </div>
      </footer>

      <Carrito numeroWhatsApp={NUMERO_WHATSAPP} />
      <CarritoFlotante />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onAdminLogin={handleAdminLoginSuccess} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} onAdminLogout={handleAdminLogout} />
      
      {/* Toast para mensajes */}
      <Toast message={toastMessage} type="success" isVisible={showToast} onClose={() => setShowToast(false)} />
      
      {/* Modal de edición de producto */}
      {productoEditar && (
        <EditarProductoModal 
          producto={productoEditar} 
          onClose={() => setProductoEditar(null)} 
        />
      )}
    </main>
  );
}

// Componente Modal para editar producto
function EditarProductoModal({ producto, onClose }: { producto: Producto; onClose: () => void }) {
  const { actualizarProducto, eliminarProducto, categorias, agregarCategoria } = useProducts();
  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio.toString(),
    categoria: producto.categoria,
  });
  const [imagenPreview, setImagenPreview] = useState(producto.imagen);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNuevaCategoria, setShowNuevaCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  // Obtener categorías reales (sin "Todas")
  const categoriasReales = categorias.filter(c => c !== "Todas");

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
    actualizarProducto(producto.id, {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio),
      categoria: formData.categoria,
      imagen: imagenPreview,
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleDelete = () => {
    eliminarProducto(producto.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Editar Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                required
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
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNuevaCategoria(false);
                      setNuevaCategoria("");
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    {categoriasReales.map((cat: string) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            {imagenPreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagenPreview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => setImagenPreview("")}
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
                <p className="text-gray-500 text-sm">Seleccionar imagen</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-xl font-bold transition-colors"
            >
              Eliminar
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </form>

        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar producto?</h3>
              <p className="text-gray-500 text-sm mb-4">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-bold transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">¡Actualizado!</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
