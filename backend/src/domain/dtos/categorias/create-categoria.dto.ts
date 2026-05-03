export class CreateCategoriaDto {
  private constructor(
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {}

  static create(object: { [key: string]: any }): [any?, CreateCategoriaDto?] {
    const { nombre, descripcion } = object;

    const errors: any = {};

    if (!nombre || nombre.trim() === '') {
      errors.nombre = 'El nombre es obligatorio';
    }

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new CreateCategoriaDto(nombre, descripcion)];
  }
}