import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductsRepository } from "./products.re\pository";
import { CategoryRepository } from "src/categories/category.repository";
import { S3Service } from "src/common/s3/s3.service";

@Injectable()
export class ProductsService {

    constructor(private readonly productsRepository: ProductsRepository, private readonly categoryRepository: CategoryRepository,private readonly s3Service: S3Service  ) { }

    async createProduct(data: CreateProductDto,file: Express.Multer.File) {
        console.log('Creating product with data:', data);
        const category = await this.categoryRepository.findById(data.categoryId);
        if (!category) {
            throw new NotFoundException('Category not found'); // 🔥
        }
        console.log('File uploaded:', file);
        const { key, url } = await this.s3Service.uploadFile(file);
        return await this.productsRepository.createProduct({ ...data, category, imageKey: key });
    }

    async getProducts() {
        const products = await this.productsRepository.findAll();
        const updatedProducts = await Promise.all(
            products.map(async (product) => ({
                ...product,
                imageUrl: product.imageKey ? await this.s3Service.getSignedUrl(product.imageKey) : null, // 🔥 return signed URL
            }))
        );
        return updatedProducts;
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