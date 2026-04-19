import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryRepository {

    private repo: Repository<Category>;

    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(Category);
    }

    async findAll() {
        return this.repo.find();
    }

    async createCategory(data: Partial<Category>) {
        const category = this.repo.create(data);
        return this.repo.save(category);
    }

    async findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

}