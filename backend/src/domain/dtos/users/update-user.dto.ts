import { regularExps } from '../../../config/regular-exp';

export class UpdateUserDto {
  private constructor(
    public readonly id: number,
    public readonly nombre?: string,
    public readonly email?: string,
    public readonly rol?: string,
    public readonly password?: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre) returnObj.nombre = this.nombre;
    if (this.email) returnObj.email = this.email;
    if (this.rol) returnObj.rol = this.rol;
    if (this.password) returnObj.password = this.password;

    return returnObj;
  }

  static create(props: { [key: string]: any }): [
    {
      [key: string]: string;
    }?,
    UpdateUserDto?,
  ] {
    const { id, nombre, email, rol, password } = props;
    const errors: { [key: string]: string } = {};

    if (!id || Number(isNaN(id)))
      return [{ id: 'El ID debe ser un número válido' }, undefined];

    if (email !== undefined) {
      if (!regularExps.email.test(email)) {
        errors.email = 'El email no es válido.';
      }
    }

    if (rol !== undefined) {
      const allowedRoles = ['ADMINISTRADOR', 'CAJERO', 'INVENTARIO'];
      if (!allowedRoles.includes(rol.toUpperCase().trim())) {
        errors.rol = `Roles permitidos: ${allowedRoles.join(', ')}.`;
      }
    }

    if (password !== undefined) {
      if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    if (Object.keys(errors).length > 0) return [errors, undefined];

    return [
      undefined,
      new UpdateUserDto(
        id,
        nombre?.trim(),
        email?.toLowerCase().trim(),
        rol?.toUpperCase().trim(),
        password
      ),
    ];
  }
}
