export class UpdateProveedorDto {
  private constructor(
    public readonly id: number,
    public readonly values: { [key: string]: any }
  ) {}

  static create(object: { [key: string]: any }): [any?, UpdateProveedorDto?] {
    const { id, ...rest } = object;

    if (!id || isNaN(id) || id <= 0) {
      return [['ID inválido']];
    }

    if (Object.keys(rest).length === 0) {
      return [['No hay datos para actualizar']];
    }

    return [undefined, new UpdateProveedorDto(id, rest)];
  }
}