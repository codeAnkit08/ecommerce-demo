import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductsRepository } from "./products.re\pository";
import { NotFoundError } from "rxjs";
import { CategoryRepository } from "src/categories/category.repository";

@Injectable()
export class ProductsService {

    constructor(private readonly productsRepository: ProductsRepository, private readonly categoryRepository: CategoryRepository) { }

    async createProduct(data: CreateProductDto) {
        const category = await this.categoryRepository.findById(data.categoryId);
        if (!category) {
            throw new NotFoundException('Category not found'); // 🔥
        }
        return await this.productsRepository.createProduct({ ...data, category });
    }

    async getProducts() {
        return await this.productsRepository.findAll();
    }

    async getProductById(id: string) {
        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found'); // 🔥
        }
        return product;
    }

    async deleteProductById(id: string) {
        return await this.productsRepository.deleteById(id);
    }

    async updateProductById(id: string, data: CreateProductDto) {
        const product = await this.productsRepository.findById(id);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const { categoryId, ...rest } = data;

        Object.assign(product, rest);

        if (categoryId) {
            const category = await this.categoryRepository.findById(categoryId);

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            product.category = category; // ✅ only id matters
        }

        return await this.productsRepository.updateById(id, product); // 🔥 important
    }
}