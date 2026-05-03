export class CreateProveedorDto {
  private constructor(
    public readonly nombre_empresa: string,
    public readonly contacto?: string,
    public readonly telefono?: string
  ) {}

  static create(object: { [key: string]: any }): [any?, CreateProveedorDto?] {
    const { nombre_empresa, contacto, telefono } = object;

    const errors: any = {};

    if (!nombre_empresa || nombre_empresa.trim() === '') {
      errors.nombre_empresa = 'El nombre de la empresa es obligatorio';
    }

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new CreateProveedorDto(nombre_empresa, contacto, telefono)];
  }
}