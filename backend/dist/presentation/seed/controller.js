"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedController = void 0;
const posgres_1 = require("../../data/posgres");
// Función auxiliar para generar fechas aleatorias en el pasado
const getRandomPastDate = (daysBack = 30) => {
    const date = new Date();
    // Restamos días aleatorios (0 para hoy, 1 para ayer, etc.)
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    // Ponemos una hora, minuto y segundo aleatorios para más realismo
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);
    return date;
};
class SeedController {
    constructor() {
        this.runSeed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Limpiando base de datos y reiniciando IDs...');
                // 1. Borrar datos en orden inverso (por las llaves foráneas)
                yield posgres_1.prisma.ingreso_inventario.deleteMany();
                yield posgres_1.prisma.detalle_Venta_Producto.deleteMany();
                yield posgres_1.prisma.venta.deleteMany();
                yield posgres_1.prisma.producto.deleteMany();
                yield posgres_1.prisma.categoria.deleteMany();
                yield posgres_1.prisma.proveedor.deleteMany();
                yield posgres_1.prisma.usuario.deleteMany();
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
                    yield posgres_1.prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
                }
                console.log('Iniciando sembrado de datos...');
                // --- DATOS MAESTROS ---
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
                    'Analgésicos',
                    'Antibióticos',
                    'Vitaminas',
                    'Cuidado Personal',
                    'Primeros Auxilios',
                    'Dermatología',
                    'Salud Digestiva',
                    'Cuidado Infantil',
                    'Salud Femenina',
                    'Material Médico',
                    'Antigripales',
                    'Salud Ocular',
                    'Cuidado Bucal',
                    'Antialérgicos',
                    'Salud Cardiovascular',
                    'Relajantes Musculares',
                    'Nutrición',
                    'Cuidado Capilar',
                    'Antimicóticos',
                    'Ortopedia',
                ];
                const proveedoresLabs = [
                    'Farmindustria',
                    'Bayer',
                    'Genfar',
                    'Pfizer',
                    'Lab Portugal',
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
                    { nombre: 'Vitamina C 1g', desc: 'Tubo x 10 tabletas', precio: 22.0 },
                    { nombre: 'Sal de Andrews', desc: 'Caja x 50 sobres', precio: 30.0 },
                    {
                        nombre: 'Alcohol Medicinal 70°',
                        desc: 'Frasco x 1 Litro',
                        precio: 12.0,
                    },
                    { nombre: 'Agua Oxigenada', desc: 'Frasco x 120ml', precio: 3.5 },
                    { nombre: 'Algodón Hidrófilo', desc: 'Bolsa x 100g', precio: 4.0 },
                    {
                        nombre: 'Gasa Estéril',
                        desc: 'Paquete x 100 unidades',
                        precio: 10.0,
                    },
                    { nombre: 'Esparadrapo Tela', desc: 'Rollo 5cm x 4.5m', precio: 8.5 },
                    { nombre: 'Nastizol', desc: 'Caja x 100 tabletas', precio: 85.0 },
                    { nombre: 'Gripeal', desc: 'Caja x 100 tabletas', precio: 60.0 },
                    { nombre: 'Bismutol', desc: 'Frasco x 150ml', precio: 18.0 },
                    { nombre: 'Omeprazol 20mg', desc: 'Caja x 30 cápsulas', precio: 14.0 },
                    { nombre: 'Loratadina 10mg', desc: 'Caja x 20 tabletas', precio: 9.0 },
                    {
                        nombre: 'Cetirizina 10mg',
                        desc: 'Caja x 100 tabletas',
                        precio: 25.0,
                    },
                    { nombre: 'Dolocordralan', desc: 'Caja x 20 tabletas', precio: 32.0 },
                    { nombre: 'Ensure Advance', desc: 'Lata x 400g', precio: 65.0 },
                ];
                // --- INSERCIÓN ---
                // 1. Usuarios (Admin, Inventario, Cajero específicos)
                const usuariosData = nombresUsuarios.map((nombre, i) => {
                    let email = nombre.toLowerCase().replace(/\s+/g, '.') + '@novasalud.com';
                    let rol = i % 2 === 0 ? 'CAJERO' : 'INVENTARIO';
                    if (i === 0) {
                        email = 'admin@novasalud.com';
                        rol = 'ADMINISTRADOR';
                    }
                    else if (i === 1) {
                        email = 'inventario@novasalud.com';
                        rol = 'INVENTARIO';
                    }
                    else if (i === 2) {
                        email = 'cajero@novasalud.com';
                        rol = 'CAJERO';
                    }
                    return { nombre, email, password: '123456', rol, activo: true };
                });
                yield posgres_1.prisma.usuario.createMany({ data: usuariosData });
                // 2. Categorías
                yield posgres_1.prisma.categoria.createMany({
                    data: categoriasFarmacia.map((cat) => ({
                        nombre: cat,
                        descripcion: `Productos de ${cat}`,
                        activo: true,
                    })),
                });
                // 3. Proveedores
                yield posgres_1.prisma.proveedor.createMany({
                    data: proveedoresLabs.map((prov) => ({
                        nombre_empresa: prov,
                        contacto: 'Ventas Corp',
                        telefono: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
                        activo: true,
                    })),
                });
                // 4. Productos (Con algunos en STOCK BAJO)
                const productosData = productosFarmacia.map((prod, i) => {
                    const stockMinimo = 15;
                    // Cada 4 productos, creamos uno con stock bajo (entre 2 y 8)
                    const stockActual = i % 4 === 0
                        ? Math.floor(Math.random() * 7) + 2
                        : Math.floor(Math.random() * 50) + 20;
                    return {
                        id_categoria: (i % 20) + 1,
                        id_proveedor: (i % 20) + 1,
                        codigo_barras: `775${Math.floor(100000000 + Math.random() * 900000000)}`,
                        nombre: prod.nombre,
                        descripcion: prod.desc,
                        precio_venta: prod.precio,
                        stock_actual: stockActual,
                        stock_minimo: stockMinimo,
                        activo: true,
                    };
                });
                yield posgres_1.prisma.producto.createMany({ data: productosData });
                // 5. Ventas (Fechas realistas: fecha_hora)
                const ventasData = Array.from({ length: 25 }).map((_, i) => ({
                    id_usuario: (i % 5) + 1,
                    total: 0, // Se actualizará lógicamente o se deja como seed base
                    metodo_pago: i % 2 === 0 ? 'Efectivo' : 'Tarjeta',
                    fecha_hora: getRandomPastDate(15), // Ventas de los últimos 15 días
                }));
                // Nota: En un seed real con Decimal, 'total' suele calcularse,
                // aquí ponemos un valor random para que no sea 0
                ventasData.forEach((v) => (v.total = Math.floor(Math.random() * 100) + 20));
                yield posgres_1.prisma.venta.createMany({ data: ventasData });
                // 6. Detalles de Venta
                const detallesVentaData = Array.from({ length: 40 }).map((_, i) => {
                    const precio = productosFarmacia[i % 20].precio;
                    const cant = Math.floor(Math.random() * 3) + 1;
                    return {
                        id_venta: (i % 25) + 1,
                        id_producto: (i % 20) + 1,
                        cantidad: cant,
                        precio_unitario: precio,
                        subtotal: precio * cant,
                    };
                });
                yield posgres_1.prisma.detalle_Venta_Producto.createMany({
                    data: detallesVentaData,
                });
                // 7. Ingresos de Inventario (Fechas realistas: fecha_ingreso)
                const ingresosData = Array.from({ length: 15 }).map((_, i) => ({
                    id_producto: (i % 20) + 1,
                    id_usuario: 2, // Usuario Inventario (que configuramos en la posición 1 -> ID 2)
                    cantidad_ingresada: Math.floor(Math.random() * 50) + 10,
                    fecha_ingreso: getRandomPastDate(30), // Ingresos del último mes
                }));
                yield posgres_1.prisma.ingreso_inventario.createMany({ data: ingresosData });
                console.log('Sembrado completado con éxito.');
                // --- RECUPERAR USUARIOS DE PRUEBA ---
                const adminUser = yield posgres_1.prisma.usuario.findUnique({
                    where: { email: 'admin@novasalud.com' },
                });
                const inventarioUser = yield posgres_1.prisma.usuario.findUnique({
                    where: { email: 'inventario@novasalud.com' },
                });
                const cajeroUser = yield posgres_1.prisma.usuario.findUnique({
                    where: { email: 'cajero@novasalud.com' },
                });
                return res.status(201).json({
                    status: 'success',
                    message: 'Base de datos limpiada y ejecutado el seed correctamente.',
                    data: {
                        testAccounts: {
                            admin: adminUser,
                            inventario: inventarioUser,
                            cajero: cajeroUser,
                        },
                    },
                });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ status: 'error', message: 'Error en el seed', errors: error });
            }
        });
    }
}
exports.SeedController = SeedController;
