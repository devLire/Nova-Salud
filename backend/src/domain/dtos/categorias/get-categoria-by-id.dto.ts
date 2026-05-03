export class GetCategoriaByIdDto {
  private constructor(
    public readonly id: number
  ) {}

  static create(id: number): [string[]?, GetCategoriaByIdDto?] {
    if (!id || isNaN(id) || id <= 0) {
      return [['ID inválido']];
    }

    return [undefined, new GetCategoriaByIdDto(id)];
  }
}