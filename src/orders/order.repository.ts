import { DataSource, In, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderRepository {

    private repo: Repository<Order>;

    constructor(private dataSource: DataSource) {
        this.repo = this.dataSource.getRepository(Order);
    }

    async findAll(): Promise<Order[]> {
        return this.repo.find({
            relations: ['items', 'items.product'], // 🔥 important
        });
    }

    async findById(id: string): Promise<Order | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['items', 'items.product'], // 🔥
        });
    }

    async createOrder(data: Partial<Order>): Promise<Order> {
        const order = this.repo.create(data);
        return this.repo.save(order);
    }

    async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
        const order = await this.findById(id);

        if (!order) {
            throw new Error('Order not found');
        }

        Object.assign(order, data);

        return this.repo.save(order); // 🔥 better
    }

    async removeOrder(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['items', 'items.product'],
        });
    }
}    