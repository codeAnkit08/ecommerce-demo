import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role.decorator";

@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createProduct(@Body() data: CreateProductDto) {
        console.log('Creating product:', data);
        return await this.productService.createProduct(data);
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