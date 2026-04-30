import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { CategoryModel } from 'src/categories/category.model';

@ObjectType()
export class ProductModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Float)
  price!: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => CategoryModel, { nullable: true })
  category?: string;
}