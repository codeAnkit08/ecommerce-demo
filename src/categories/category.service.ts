import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";

@Injectable()
export class CategoryService {

    constructor(private readonly categoryRepository: CategoryRepository) {}

    async getCategories() {
        return this.categoryRepository.findAll();
    }

    async createCategory(data: CreateCategoryDto) {
        return this.categoryRepository.createCategory(data);
    }
}