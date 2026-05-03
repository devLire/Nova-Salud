export class GetProveedoresDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(page: number, limit: number): [string[]?, GetProveedoresDto?] {
    const errors: string[] = [];

    if (page <= 0) errors.push('Page debe ser mayor a 0');
    if (limit <= 0) errors.push('Limit debe ser mayor a 0');

    if (errors.length > 0) return [errors];

    return [undefined, new GetProveedoresDto(page, limit)];
  }
}