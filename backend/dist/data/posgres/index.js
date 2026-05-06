"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const prisma_1 = require("../../../generated/prisma");
const connectionString = `${process.env.POSTGRES_URL}`;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new prisma_1.PrismaClient({ adapter });
exports.prisma = prisma;
