import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartRepository {
    private repo: Repository<Cart>;

    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(Cart);
    }

    // 🔹 Create Cart
    async create(data: Partial<Cart>) {
        const cart = this.repo.create(data);
        return await this.repo.save(cart);
    }

    // 🔹 Find cart by userId
    async findByUserId(userId: string) {
        return await this.repo.findOne({
            where: { user: { id: userId } },
        });
    }

    // 🔹 Get full cart with items & products
    async findWithItems(userId: string) {
        return await this.repo.findOne({
            where: { userId }, // 🔥 direct column
            relations: ['items', 'items.product'],
        });
    }
}