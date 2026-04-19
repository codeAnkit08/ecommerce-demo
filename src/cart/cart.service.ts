import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartItemRepository } from './cart-item.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private cartItemRepo: CartItemRepository,
    private productRepo: ProductsRepository,
    private usersService: UsersService,

  ) { }

  // 🛒 Add to cart
  async addToCart(userId: string, dto: any) {
    const { productId, quantity } = dto;
    console.log('Adding to cart:', { userId, productId, quantity });

    try {
      // 🔹 Get or create cart
      const user = await this.usersService.getUserById(userId);
      let cart = await this.cartRepo.findByUserId(userId);
      console.log('Cart found:', cart);
      if (!cart) {
         cart = await this.cartRepo.create({
         user: user as User,
        });
      }

      console.log("cart created",cart);

      // 🔹 Check product
      const product = await this.productRepo.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      console.log('Product found:', product);
      // 🔹 Check existing item
      const existingItem = await this.cartItemRepo.findByCartAndProduct(
        cart.id,
        product.id,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        return await this.cartItemRepo.save(existingItem);
      }

      console.log('Adding to cart:', { userId, productId, quantity });

      // 🔹 Create new item
      return await this.cartItemRepo.create({
        cart,
        product,
        quantity,
      });
    }
    catch (error) {
      console.error('Error adding to cart:', error);
      throw new BadRequestException('Failed to add item to cart');
    }
  }

  // 📦 Get full cart
  async getCart(userId: string) {
    const cart = await this.cartRepo.findWithItems(userId);
    console.log('Cart retrieved for userId:', userId, cart);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  // ❌ Remove item
  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartRepo.findWithItems(userId);
    console.log("itemId----->",itemId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    console.log("cart items----->",cart.items);

    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return await this.cartItemRepo.remove(item);
  }

  // 🔄 Update quantity
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.cartRepo.findWithItems(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    item.quantity = quantity;

    return await this.cartItemRepo.save(item);
  }
}