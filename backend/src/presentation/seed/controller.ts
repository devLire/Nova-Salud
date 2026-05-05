import { Request, Response } from 'express';
import { prisma } from '../../data/posgres';

export class SeedController {
  constructor() {}

  public runSeed = async (req: Request, res: Response) => {
    try {
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
        'Usuario',
        'Categoria',
        'Proveedor',
        'Producto',
        'Venta',
        'Detalle_Venta_Producto',
        'Ingreso_inventario',
      ];

      for (const table of tables) {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
        );
      }

      console.log(
        'Base de datos limpia. Iniciando sembrado con datos reales...'
      );

      const nombresUsuarios = [
        'Igor Pérez',
        'Juan Perez',
        'Maria Garcia',
        'Carlos Lopez',
        'Ana Martinez',
        'Luis Rodriguez',
        'Carmen Fernandez',
        'Jorge Sanchez',
        'Rosa Gomez',
        'Pedro Diaz',
        'Miguel Torres',
        'Lucia Ruiz',
        'Jose Ramirez',
        'Elena Flores',
        'Fernando Benitez',
        'Silvia Acosta',
        'Ricardo Medina',
        'Teresa Castro',
        'Daniel Vargas',
        'Patricia Rios',
      ];

      const categoriasFarmacia = [
        'Analgésicos y Antipiréticos',
        'Antibióticos',
        'Vitaminas y Suplementos',
        'Cuidado Personal',
        'Primeros Auxilios',
        'Dermatología',
        'Salud Digestiva',
        'Cuidado Infantil',
        'Salud Femenina',
        'Material Médico',
        'Antigripales y Tos',
        'Salud Ocular',
        'Cuidado Bucal',
        'Antialérgicos',
        'Salud Cardiovascular',
        'Relajantes Musculares',
        'Nutrición Especializada',
        'Cuidado Capilar',
        'Antimicóticos',
        'Ortopedia',
      ];

      const proveedoresLabs = [
        'Farmindustria',
        'Bayer',
        'Genfar',
        'Pfizer',
        'Laboratorios Portugal',
        'Hersil',
        'GSK',
        'Roche',
        'Sanofi',
        'Teva',
        'Novartis',
        'Abbott',
        'Medifarma',
        'Química Suiza',
        'Cifarma',
        'IQFarma',
        'Bagó',
        'Roemmers',
        'Saval',
        'Unimed',
      ];

      const productosFarmacia = [
        {
          nombre: 'Paracetamol 500mg',
          desc: 'Caja x 100 tabletas',
          precio: 15.5,
        },
        {
          nombre: 'Ibuprofeno 400mg',
          desc: 'Caja x 50 tabletas',
          precio: 20.0,
        },
        {
          nombre: 'Amoxicilina 500mg',
          desc: 'Caja x 50 cápsulas',
          precio: 35.0,
        },
        {
          nombre: 'Panadol Antigripal',
          desc: 'Caja x 20 tabletas',
          precio: 18.5,
        },
        { nombre: 'Apronax 550mg', desc: 'Caja x 20 tabletas', precio: 45.0 },
        {
          nombre: 'Vitamina C 1g',
          desc: 'Tubo x 10 tabletas efervescentes',
          precio: 22.0,
        },
        { nombre: 'Sal de Andrews', desc: 'Caja x 50 sobres', precio: 30.0 },
        {
          nombre: 'Alcohol Medicinal 70°',
          desc: 'Frasco x 1 Litro',
          precio: 12.0,
        },
        {
          nombre: 'Agua Oxigenada 10 Vol.',
          desc: 'Frasco x 120ml',
          precio: 3.5,
        },
        { nombre: 'Algodón Hidrófilo', desc: 'Bolsa x 100g', precio: 4.0 },
        {
          nombre: 'Gasa Estéril',
          desc: 'Paquete x 100 unidades',
          precio: 10.0,
        },
        { nombre: 'Esparadrapo Tela', desc: 'Rollo 5cm x 4.5m', precio: 8.5 },
        {
          nombre: 'Nastizol Composición',
          desc: 'Caja x 100 tabletas',
          precio: 85.0,
        },
        { nombre: 'Gripeal', desc: 'Caja x 100 tabletas', precio: 60.0 },
        { nombre: 'Bismutol', desc: 'Frasco x 150ml', precio: 18.0 },
        { nombre: 'Omeprazol 20mg', desc: 'Caja x 30 cápsulas', precio: 14.0 },
        { nombre: 'Loratadina 10mg', desc: 'Caja x 20 tabletas', precio: 9.0 },
        {
          nombre: 'Cetirizina 10mg',
          desc: 'Caja x 100 tabletas',
          precio: 25.0,
        },
        {
          nombre: 'Dolocordralan Extra Forte',
          desc: 'Caja x 20 tabletas',
          precio: 32.0,
        },
        {
          nombre: 'Ensure Advance Vainilla',
          desc: 'Lata x 400g',
          precio: 65.0,
        },
      ];

      // --- INSERCIÓN DE DATOS ---

      // 1. Crear 20 Usuarios
      const usuariosData = nombresUsuarios.map((nombreCompleto, i) => {
        // Convierte "Juan Perez" a "juan.perez@ejemplo.com"
        const emailFormateado =
          nombreCompleto.toLowerCase().replace(/\s+/g, '.') + '@novasalud.com';

        return {
          nombre: nombreCompleto,
          email: i === 0 ? 'admin@novasalud.com' : emailFormateado,
          password: '123456', // Contraseña solicitada
          rol:
            i === 0
              ? 'ADMINISTRADOR'
              : ((i % 2 === 0 ? 'CAJERO' : 'INVENTARIO') as
                  | 'ADMINISTRADOR'
                  | 'CAJERO'
                  | 'INVENTARIO'),
          activo: true,
        };
      });
      await prisma.usuario.createMany({ data: usuariosData });

      // 2. Crear 20 Categorías
      const categoriasData = categoriasFarmacia.map((cat, i) => ({
        nombre: cat,
        descripcion: `Productos relacionados a ${cat.toLowerCase()}`,
        activo: true,
      }));
      await prisma.categoria.createMany({ data: categoriasData });

      // 3. Crear 20 Proveedores
      const proveedoresData = proveedoresLabs.map((prov, i) => ({
        nombre_empresa: prov,
        contacto: `Representante de ${prov}`,
        telefono: `9${Math.floor(10000000 + Math.random() * 90000000)}`, // Genera un teléfono peruano aleatorio
        activo: true,
      }));
      await prisma.proveedor.createMany({ data: proveedoresData });

      // 4. Crear 20 Productos
      const productosData = productosFarmacia.map((prod, i) => ({
        id_categoria: (i % 20) + 1,
        id_proveedor: (i % 20) + 1,
        codigo_barras: `775${Math.floor(100000000 + Math.random() * 900000000)}`, // Código de barras formato EAN-13
        nombre: prod.nombre,
        descripcion: prod.desc,
        precio_venta: prod.precio,
        stock_actual: Math.floor(Math.random() * 80) + 20, // Stock entre 20 y 100
        stock_minimo: 15,
        activo: true,
      }));
      await prisma.producto.createMany({ data: productosData });

      // 5. Crear 20 Ventas
      const ventasData = Array.from({ length: 20 }).map((_, i) => ({
        id_usuario: (i % 20) + 1,
        total: Math.round((Math.random() * 150 + 20) * 100) / 100, // Total aleatorio entre 20 y 170
        metodo_pago: i % 2 === 0 ? 'Efectivo' : 'Tarjeta',
      }));
      await prisma.venta.createMany({ data: ventasData });

      // 6. Crear 20 Detalles de Venta
      const detallesVentaData = Array.from({ length: 20 }).map((_, i) => ({
        id_venta: (i % 20) + 1,
        id_producto: (i % 20) + 1,
        cantidad: Math.floor(Math.random() * 5) + 1, // Cantidad entre 1 y 5
        precio_unitario: productosFarmacia[i].precio,
        subtotal:
          productosFarmacia[i].precio * (Math.floor(Math.random() * 5) + 1),
      }));
      await prisma.detalle_Venta_Producto.createMany({
        data: detallesVentaData,
      });

      // 7. Crear 20 Ingresos de Inventario
      const ingresosData = Array.from({ length: 20 }).map((_, i) => ({
        id_producto: (i % 20) + 1,
        id_usuario: (i % 20) + 1,
        cantidad_ingresada: Math.floor(Math.random() * 100) + 50, // Entre 50 y 150
      }));
      await prisma.ingreso_inventario.createMany({ data: ingresosData });

      console.log('Sembrado completado con éxito.');

      const adminUser = await prisma.usuario.findUnique({
        where: { email: 'admin@novasalud.com' },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Base de datos limpiada y ejecutado el seed',
        data: adminUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Error al ejecutar el seed',
        errors: error,
      });
    }
  };
}
