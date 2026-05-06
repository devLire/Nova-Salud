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
exports.UserController = void 0;
const posgres_1 = require("../../data/posgres");
const dtos_1 = require("../../domain/dtos");
class UserController {
    constructor() {
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, search = '' } = req.query;
            const [errors, getUsersDto] = dtos_1.GetUsersDto.create(+page, +limit);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const whereClause = {
                    activo: true,
                };
                if (search) {
                    whereClause.OR = [
                        { nombre: { contains: String(search), mode: 'insensitive' } },
                        { email: { contains: String(search), mode: 'insensitive' } },
                    ];
                }
                const [users, total] = yield Promise.all([
                    posgres_1.prisma.usuario.findMany({
                        where: whereClause,
                        skip: (getUsersDto.page - 1) * getUsersDto.limit,
                        take: getUsersDto.limit,
                        select: { id_usuario: true, nombre: true, email: true, rol: true },
                    }),
                    posgres_1.prisma.usuario.count({ where: whereClause }),
                ]);
                const hasNext = getUsersDto.page * getUsersDto.limit < total;
                const searchParam = search
                    ? `&search=${encodeURIComponent(String(search))}`
                    : '';
                return res.json({
                    status: 'success',
                    message: 'Usuarios obtenidos correctamente',
                    data: users,
                    pagination: {
                        page: getUsersDto.page,
                        limit: getUsersDto.limit,
                        total,
                        next: hasNext
                            ? `/api/users?page=${getUsersDto.page + 1}&limit=${getUsersDto.limit}${searchParam}`
                            : null,
                        prev: getUsersDto.page > 1
                            ? `/api/users?page=${getUsersDto.page - 1}&limit=${getUsersDto.limit}${searchParam}`
                            : null,
                    },
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener usuarios',
                    errors: null,
                });
            }
        });
        this.getUserByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getUserByIdDto] = dtos_1.GetUserByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const user = yield posgres_1.prisma.usuario.findUnique({
                    where: {
                        id_usuario: getUserByIdDto.id,
                    },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        rol: true,
                        email: true,
                    },
                });
                user
                    ? res.json({
                        status: 'success',
                        message: 'Usuario obtenido correctamente',
                        data: user,
                    })
                    : res.status(404).json({
                        status: 'fail',
                        message: `User with id ${id} not found`,
                        errors: null,
                    });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener usuario',
                    errors: null,
                });
            }
        });
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [errors, createUserDto] = dtos_1.CreateUserDto.create(req.body);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const existingUser = yield posgres_1.prisma.usuario.findUnique({
                    where: { email: createUserDto.email },
                });
                if (existingUser) {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'El email ya está registrado.',
                        errors: { email: 'El email ya está registrado.' },
                    });
                }
                const user = yield posgres_1.prisma.usuario.create({
                    data: {
                        nombre: createUserDto.nombre,
                        email: createUserDto.email,
                        password: createUserDto.password,
                        rol: createUserDto.rol,
                    },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        rol: true,
                        email: true,
                    },
                });
                res.status(201).json({
                    status: 'success',
                    message: 'Usuario creado correctamente',
                    data: user,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Error al crear usuario en el servidor.',
                    errors: null,
                });
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, updateUserDto] = dtos_1.UpdateUserDto.create(Object.assign(Object.assign({}, req.body), { id }));
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const user = yield posgres_1.prisma.usuario.findUnique({
                    where: { id_usuario: id },
                });
                if (!user)
                    return res.status(404).json({
                        status: 'fail',
                        message: `User with ID ${id} not found`,
                        errors: null,
                    });
                if (updateUserDto === null || updateUserDto === void 0 ? void 0 : updateUserDto.email) {
                    const existingUser = yield posgres_1.prisma.usuario.findFirst({
                        where: {
                            email: updateUserDto.email,
                            NOT: { id_usuario: id },
                        },
                    });
                    if (existingUser) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'El email ya está registrado por otro usuario',
                            errors: { email: 'El email ya está registrado por otro usuario' },
                        });
                    }
                }
                const updatedUser = yield posgres_1.prisma.usuario.update({
                    where: {
                        id_usuario: id,
                    },
                    data: updateUserDto.values,
                    select: {
                        id_usuario: true,
                        nombre: true,
                        rol: true,
                        email: true,
                    },
                });
                res.json({
                    status: 'success',
                    message: 'Usuario actualizado correctamente',
                    data: updatedUser,
                });
            }
            catch (e) {
                res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar usuario',
                    errors: null,
                });
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [errors, getUserByIdDto] = dtos_1.GetUserByIdDto.create(id);
            if (errors)
                return res.status(400).json({
                    status: 'fail',
                    message: 'Los datos proporcionados no son válidos.',
                    errors,
                });
            try {
                const userExists = yield posgres_1.prisma.usuario.findUnique({
                    where: { id_usuario: getUserByIdDto.id },
                });
                if (!userExists) {
                    return res.status(404).json({
                        status: 'fail',
                        message: `User with ID ${getUserByIdDto.id} not found`,
                        errors: null,
                    });
                }
                const deletedUser = yield posgres_1.prisma.usuario.update({
                    where: {
                        id_usuario: getUserByIdDto.id,
                    },
                    data: {
                        activo: false,
                    },
                    select: {
                        id_usuario: true,
                        nombre: true,
                        rol: true,
                        email: true,
                    },
                });
                return res.json({
                    status: 'success',
                    message: 'Usuario eliminado correctamente',
                    data: deletedUser,
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar usuario',
                    errors: null,
                });
            }
        });
    }
}
exports.UserController = UserController;
