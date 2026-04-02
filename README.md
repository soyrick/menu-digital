# 🍔 Burger House - Menú Digital

> Una experiencia de pedidos moderna y elegante para tu restaurante.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)

---

## 🚀 Características

### 👤 Para Clientes
- 🌐 **Menú digital interactivo** con categorías dinamicas
- 🛒 **Carrito de compras** completo con persistencia local
- 📱 **Diseño 100% responsive** que se adapta a cualquier dispositivo
- 🔐 **Sistema de autenticación** para clientes registrados
- 📍 **Gestión de direcciones** - dirección predeterminada o nueva entrega
- 📱 **Pedidos por WhatsApp** - envío directo al restaurante
- ✨ **Interfaz suave y moderna** con animaciones fluidas

### ⚙️ Para Administradores
- 🔒 **Panel de administración** seguro con autenticación
- 📝 **Gestión de productos** - agregar, editar y eliminar
- 🎨 **Personalización del header** - color o imagen de fondo
- 🏷️ **Categorías dinámicas** - crea tus propias categorías
- 📊 **Panel de pedidos** con seguimiento en tiempo real
- 📈 **Estadísticas de ventas** - productos más vendidos
- 🔄 **Persistencia de datos** - todo se guarda automáticamente

---

## 🛠️ Tecnologías

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado:** React Context API
- **Persistencia:** LocalStorage
- **Imágenes:** Next.js Image Optimization

---

## 🏃‍♂️ Cómo Ejecutar

```bash
# Clona el repositorio
git clone <repo-url>

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔑 Credenciales

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Admin | cualquier email | comienza con `admin` |

---

## 📁 Estructura

```
src/
├── app/                 # Páginas y rutas
│   ├── page.tsx        # Página principal
│   ├── admin/          # Panel de admin
│   └── layout.tsx     # Layout principal
├── components/        # Componentes reutilizables
├── context/           # Estado global
├── data/              # Datos iniciales
└── styles/            # Estilos globales
```

---

## 🎨 Diseño

- **Tipografía:** Playfair Display (títulos) + Inter (cuerpo)
- **Paleta de colores:** Naranja principales con acentos en tonos cálidos
- **UI/UX:** Diseño limpio, moderno y centrado en la experiencia del usuario

---

## 📱 Responsive

El menú está optimizado para funcionar perfectamente en:
- 📱 Teléfonos móviles
- tablets
- 💻 Computadoras de escritorio

---

## ⚡ Características Técnicas

- Server Side Rendering con Next.js
- Optimización de imágenes automática
- Persistencia de datos con localStorage
- Estados globales con React Context
- TypeScript para mayor seguridad en el código

---

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para tu propio restaurante.

---

<div align="center">

Hecho con ❤️ para Burger House

</div>