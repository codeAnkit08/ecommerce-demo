import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";

@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: multer.memoryStorage(),
        }),
    )
    @Roles('admin')
    @Post()
    async createProduct(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: CreateProductDto) {
        const  product = await this.productService.createProduct(data, file);
        return {
            success: true,
            data: product,
            message: "Product created successfully"
        }
    }

    @Get()
    async getProducts() {
        return await this.productService.getProducts();
    }

    @Get(':id')
    async getProductById(@Param("id") id: string) {
        return  await this.productService.getProductById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteProductById(@Param("id")id: string) {
        return await this.productService.deleteProductById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async updateProductById(@Param("id") id: string, @Body() data: CreateProductDto) {
        return await this.productService.updateProductById(id, data);
    }
}