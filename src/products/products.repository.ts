import { DataSource, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsRepository {

    private repo: Repository<Product>;

    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(Product);
    }

    async createProduct(data: Partial<Product>) {
        console.log('Creating product with data:', data);
        const product = this.repo.create(data);
        return this.repo.save(product);
    }

    async findAll() {
        return this.repo.find({
            relations: ['category'], // 🔥 important
        });
    }

    async findById(id: string) {
        return this.repo.findOne({ where: { id }, relations: ['category'] });
    }

    async deleteById(id: string) {
        return this.repo.delete(id);
    }

    async updateById(id: string, data: Partial<Product>) {
        await this.repo.update(id, data);
        return this.findById(id);
    }
}