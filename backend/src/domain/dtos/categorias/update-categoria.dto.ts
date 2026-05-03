export class UpdateCategoriaDto {
  private constructor(
    public readonly id: number,
    public readonly nombre?: string,
    public readonly descripcion?: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.nombre) returnObj.nombre = this.nombre;
    if (this.descripcion !== undefined)
      returnObj.descripcion = this.descripcion;

    return returnObj;
  }

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateCategoriaDto?] {
    const { id, nombre, descripcion } = object;
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0) {
      return [{ id: 'El ID debe ser un número válido' }, undefined];
    }

    if (!nombre && descripcion === undefined) {
      return [{ data: 'No hay datos para actualizar' }, undefined];
    }

    return [
      undefined,
      new UpdateCategoriaDto(numericId, nombre?.trim(), descripcion?.trim()),
    ];
  }
}
