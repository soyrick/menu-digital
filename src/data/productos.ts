export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
}

export const productos: Producto[] = [
  {
    id: "1",
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne jugosa, queso cheddar, lechuga, tomate y nuestra salsa especial",
    precio: 8990,
    categoria: "Hamburguesas",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    nombre: "Hamburguesa Doble",
    descripcion: "Doble carne, doble queso, bacon crujiente y cebolla caramelizada",
    precio: 12990,
    categoria: "Hamburguesas",
    imagen: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    nombre: "Hamburguesa Veggie",
    descripcion: "Hamburguesa de lentejas con vegetales asados, avocado y salsa de tahini",
    precio: 9990,
    categoria: "Hamburguesas",
    imagen: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    nombre: "Papas Fritas Grandes",
    descripcion: "Papas doradas con crispy externo y suaves por dentro",
    precio: 3990,
    categoria: "Acompañamientos",
    imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd6f248?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    nombre: "Aros de Cebolla",
    descripcion: "Aros dorados y crujientes con dip de ajo",
    precio: 4490,
    categoria: "Acompañamientos",
    imagen: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    nombre: "Batata Frita",
    descripcion: "Batatas naturales con romero y sal",
    precio: 4290,
    categoria: "Acompañamientos",
    imagen: "https://images.unsplash.com/photo-1529589510304-b7e994a92f60?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    nombre: "Coca-Cola",
    descripcion: "Lata 350ml",
    precio: 1990,
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    nombre: "Agua Mineral",
    descripcion: "Botella 500ml",
    precio: 1490,
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=300&fit=crop",
  },
  {
    id: "9",
    nombre: "Limonada",
    descripcion: "Limón natural con menta fresca",
    precio: 2990,
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
  },
  {
    id: "10",
    nombre: "Cerveza Artesanal",
    descripcion: "Cerveza local de barril 400ml",
    precio: 4990,
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
  },
  {
    id: "11",
    nombre: "Flan de Vainilla",
    descripcion: "Flan casero con caramelo y crema",
    precio: 3490,
    categoria: "Postres",
    imagen: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop",
  },
  {
    id: "12",
    nombre: "Brownie con Helado",
    descripcion: "Brownie tibio de chocolate con bola de helado de vainilla",
    precio: 4490,
    categoria: "Postres",
    imagen: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
  },
];

export const categorias = ["Todas", "Hamburguesas", "Acompañamientos", "Bebidas", "Postres"];