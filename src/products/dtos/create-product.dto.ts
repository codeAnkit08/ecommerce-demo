import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @IsNotEmpty({ message: 'Product price is required' })
  price!: number;

  @IsNotEmpty({ message: 'Product description is required' })
  description!: string;

  @IsNotEmpty({ message: 'Product category is required' })
  categoryId!: string;
}