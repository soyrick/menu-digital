"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin?: () => void;
  onLoginSuccess?: () => void;
  onLogout?: () => void;
  onAdminLogout?: () => void;
}

export default function LoginModal({ isOpen, onClose, onAdminLogin, onLoginSuccess, onLogout, onAdminLogout }: LoginModalProps) {
  const router = useRouter();
  const { login } = useAdmin();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null);
  const [adminLogueado, setAdminLogueado] = useState(false);

  // Cargar usuario y admin al abrir el modal y resetear estado
  useEffect(() => {
    if (isOpen) {
      // Sempre que abra el modal, mostrar "Iniciar Sesión"
      setIsLogin(true);
      
      // Cargar usuario cliente
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        setUsuarioLogueado(JSON.parse(usuario));
      } else {
        setUsuarioLogueado(null);
      }
      
      // Cargar estado de admin
      const admin = localStorage.getItem('adminLogueado');
      setAdminLogueado(admin === 'true');
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuarioLogueado(null);
    setEmail("");
    setPassword("");
    setName("");
    setDireccion("");
    if (onLogout) onLogout();
    window.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.startsWith("admin")) {
      const success = login(password);
      if (success) {
        localStorage.setItem('adminLogueado', 'true');
        onClose();
        if (onAdminLogin) onAdminLogin();
      } else {
        setError("Contraseña de admin incorrecta");
      }
      return;
    }
    
    if (isLogin) {
      // Login: buscar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioEncontrado = usuarios.find((u: any) => u.email === email && u.password === password);
      
      if (usuarioEncontrado) {
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
        console.log("Login exitoso:", usuarioEncontrado);
        onClose();
        if (onLoginSuccess) onLoginSuccess();
        window.location.reload();
      } else {
        setError("Credenciales incorrectas");
      }
    } else {
      // Registro: guardar nuevo usuario
      const nuevoUsuario = { name, email, password, direccion };
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      console.log("Usuario registrado:", nuevoUsuario);
      onClose();
      if (onLoginSuccess) onLoginSuccess();
      window.location.reload();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Vista cuando el admin está logueado
  if (adminLogueado) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, Administrador!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Tienes acceso al panel de administración
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('adminLogueado');
                setAdminLogueado(false);
                if (onAdminLogout) onAdminLogout();
                window.location.reload();
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all duration-200"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista cuando el usuario cliente está logueado
  if (usuarioLogueado) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, {usuarioLogueado.name}!
            </h2>
            <div className="text-gray-500 text-sm space-y-1 mb-6">
              <p>📧 {usuarioLogueado.email}</p>
              {usuarioLogueado.direccion && (
                <p>📍 {usuarioLogueado.direccion}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all duration-200"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-theme-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-theme-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Accede a tu cuenta" : "Crea una cuenta nueva"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none transition-all"
                placeholder="Tu nombre"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none transition-all"
                placeholder="Tu dirección de entrega"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none transition-all"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none transition-all"
              placeholder="••••••••"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-theme-500 hover:bg-theme-600 text-white py-3 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-theme-500 font-medium text-sm hover:underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 text-left">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-gray-500 text-sm hover:text-theme-500 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h3>
            <p className="text-gray-500 text-sm mb-4">Ingresa tu correo y te enviaremos un enlace para recuperar tu contraseña.</p>
            
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-theme-500 focus:ring-2 focus:ring-theme-200 outline-none transition-all mb-4"
            />
            
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full bg-theme-500 hover:bg-theme-600 text-white py-3 rounded-xl font-bold transition-all duration-200"
            >
              Enviar Enlace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}