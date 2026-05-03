export class UpdateProveedorDto {
  private constructor(
    public readonly id: number,
    public readonly nombre_empresa?: string,
    public readonly contacto?: string,
    public readonly telefono?: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre_empresa) returnObj.nombre_empresa = this.nombre_empresa;
    if (this.contacto !== undefined) returnObj.contacto = this.contacto;
    if (this.telefono !== undefined) returnObj.telefono = this.telefono;

    return returnObj;
  }

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateProveedorDto?] {
    const { id, nombre_empresa, contacto, telefono } = object;
    const normalizedTelefono = telefono.toString();

    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    if (
      !nombre_empresa &&
      contacto === undefined &&
      normalizedTelefono === undefined
    ) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    return [
      undefined,
      new UpdateProveedorDto(
        numericId,
        nombre_empresa?.trim(),
        contacto?.trim(),
        normalizedTelefono?.trim()
      ),
    ];
  }
}
