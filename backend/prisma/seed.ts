import { prisma } from '../src/data/posgres';

async function main() {
  console.log('Limpiando base de datos y reiniciando IDs...');

  // 1. Borrar datos en orden inverso (por las llaves foráneas)
  await prisma.ingreso_inventario.deleteMany();
  await prisma.detalle_Venta_Producto.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Reiniciar los contadores (Secuencias) en PostgreSQL
  const tables = [
    'Usuario', 'Categoria', 'Proveedor', 'Producto',
    'Venta', 'Detalle_Venta_Producto', 'Ingreso_inventario'
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }

  console.log('Base de datos limpia. Iniciando sembrado...');

  // Crear 20 Usuarios
  console.log('Creando usuarios...');
  const usuariosData = Array.from({ length: 20 }).map((_, i) => ({
    nombre: `Usuario ${i + 1}`,
    email: i === 0 ? 'admin@novasalud.com' : `usuario${i + 1}@novasalud.com`,
    password: 'password123',
    rol: i === 0 ? 'ADMINISTRADOR' : (i % 2 === 0 ? 'CAJERO' : 'INVENTARIO') as 'ADMINISTRADOR' | 'CAJERO' | 'INVENTARIO',
    activo: true,
  }));
  await prisma.usuario.createMany({ data: usuariosData });

  // Crear 20 Categorías
  console.log('Creando categorías...');
  const categoriasData = Array.from({ length: 20 }).map((_, i) => ({
    nombre: `Categoría ${i + 1}`,
    descripcion: `Descripción de la categoría ${i + 1}`,
    activo: true,
  }));
  await prisma.categoria.createMany({ data: categoriasData });

  // Crear 20 Proveedores
  console.log('Creando proveedores...');
  const proveedoresData = Array.from({ length: 20 }).map((_, i) => ({
    nombre_empresa: `Proveedor ${i + 1}`,
    contacto: `Contacto ${i + 1}`,
    telefono: `555-000${i + 1}`,
    activo: true,
  }));
  await prisma.proveedor.createMany({ data: proveedoresData });

  // Crear 20 Productos
  console.log('Creando productos...');
  const productosData = Array.from({ length: 20 }).map((_, i) => ({
    id_categoria: (i % 20) + 1,
    id_proveedor: (i % 20) + 1,
    codigo_barras: `1234567890${i}`,
    nombre: `Producto ${i + 1}`,
    descripcion: `Descripción del producto ${i + 1}`,
    precio_venta: (i + 1) * 10.5,
    stock_actual: 50 + i,
    stock_minimo: 10,
    activo: true,
  }));
  await prisma.producto.createMany({ data: productosData });

  // Crear 20 Ventas
  console.log('Creando ventas...');
  const ventasData = Array.from({ length: 20 }).map((_, i) => ({
    id_usuario: (i % 20) + 1,
    total: (i + 1) * 20.0,
    metodo_pago: i % 2 === 0 ? 'Efectivo' : 'Tarjeta',
  }));
  await prisma.venta.createMany({ data: ventasData });

  // Crear 20 Detalles de Venta
  console.log('Creando detalles de venta...');
  const detallesVentaData = Array.from({ length: 20 }).map((_, i) => ({
    id_venta: (i % 20) + 1,
    id_producto: (i % 20) + 1,
    cantidad: 2,
    precio_unitario: (i + 1) * 10.0,
    subtotal: 2 * ((i + 1) * 10.0),
  }));
  await prisma.detalle_Venta_Producto.createMany({ data: detallesVentaData });

  // Crear 20 Ingresos de Inventario
  console.log('Creando ingresos de inventario...');
  const ingresosData = Array.from({ length: 20 }).map((_, i) => ({
    id_producto: (i % 20) + 1,
    id_usuario: (i % 20) + 1,
    cantidad_ingresada: 100 + i,
  }));
  await prisma.ingreso_inventario.createMany({ data: ingresosData });

  console.log('Sembrado completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
