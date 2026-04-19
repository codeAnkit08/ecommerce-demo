import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemRepository {

  private repo: Repository<CartItem>;
  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CartItem);
  }

  // 🔹 Create item
  async create(data: Partial<CartItem>) {
    const item = this.repo.create(data);
    return await this.repo.save(item);
  }

  // 🔹 Find existing item (same product in cart)
  async findByCartAndProduct(cartId: string, productId: string) {
    return await this.repo.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      },
    });
  }

  // 🔹 Save (update quantity etc.)
  async save(item: CartItem) {
    return await this.repo.save(item);
  }

  // 🔹 Remove item
  async remove(item: CartItem) {
    return await this.repo.remove(item);
  }
}