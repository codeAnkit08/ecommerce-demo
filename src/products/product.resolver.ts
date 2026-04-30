import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductModel } from './product.model';
import { ProductsService } from './products.service';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private readonly productService: ProductsService) { }

  // ✅ GET ALL PRODUCTS
  @Query(() => [ProductModel])
  async products() {
    const result = await this.productService.getProducts();
    return result;
  }

  // ✅ GET PRODUCT BY ID
  @Query(() => ProductModel)
  async product(
    @Args('id') id: string,
  ) {
    return this.productService.getProductById(id);
  }
}