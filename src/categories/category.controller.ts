import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { RolesGuard } from "src/common/guards/role.guard";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { Roles } from "src/common/decorators/role.decorator";

@Controller('categories')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}   

    @Get()    
    async getCategories() {
        return this.categoryService.getCategories();
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createCategory(@Body() data: CreateCategoryDto) {
        return this.categoryService.createCategory(data);
    }
}