export class GetProveedorByIdDto {
  private constructor(
    public readonly id: number
  ) {}

  static create(id: number): [string[]?, GetProveedorByIdDto?] {
    if (!id || isNaN(id) || id <= 0) {
      return [['ID inválido']];
    }

    return [undefined, new GetProveedorByIdDto(id)];
  }
}