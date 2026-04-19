import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { CartItemRepository } from 'src/cart/cart-item.repository';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './enums/order-status.enum';


@Injectable()
export class OrdersService {
    constructor(
        private orderRepo: OrderRepository,
        private cartRepo: CartRepository,
        private cartItemRepo: CartItemRepository,
    ) { }

    // 🛒 PLACE ORDER (MAIN FUNCTION)
    async placeOrder(userId: string) {

        console.log('Placing order for user:', userId);
        const cart = await this.cartRepo.findWithItems(userId);

        console.log('Cart retrieved:', cart);

        if (!cart || !cart.items.length) {
            throw new BadRequestException('Cart is empty');
        }

        let totalAmount = 0;

        const orderItems = cart.items.map((item) => {
            const price = item.product.price;

            totalAmount += price * item.quantity;

            return {
                product: item.product,
                quantity: item.quantity,
                price,
            };
        });

        const order = await this.orderRepo.createOrder({
            user: { id: userId } as User,
            items: orderItems as OrderItem[],
            totalAmount,
            status: OrderStatus.PENDING,
        });

        // 🔥 Clear cart after order
        for (const item of cart.items) {
            await this.cartItemRepo.remove(item);
        }

        return order;
    }

    // 📦 GET ALL ORDERS (ADMIN use-case)
    async getAllOrders() {
        return this.orderRepo.findAll();
    }

    // 👤 GET USER ORDERS
    async getUserOrders(userId: string) {
        return this.orderRepo.findByUserId(userId);
    }

    // 🔍 GET SINGLE ORDER
    async getOrderById(id: string) {
        const order = await this.orderRepo.findById(id);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    // 🔄 UPDATE ORDER STATUS (admin)
    async updateOrderStatus(id: string, newStatus: OrderStatus) {
        const order = await this.orderRepo.findById(id);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // 🔥 STATUS TRANSITION RULE
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            pending: ['paid', 'cancelled'] as OrderStatus[],
            paid: ['shipped'] as OrderStatus[],
            shipped: ['delivered'] as OrderStatus[],
            delivered: [],
            cancelled: [],
        };

        const allowedStatuses = validTransitions[order.status];

        if (!allowedStatuses.includes(newStatus)) {
            throw new BadRequestException(
                `Cannot change status from ${order.status} to ${newStatus}`,
            );
        }

        order.status = newStatus;

        return this.orderRepo.updateOrder(id, order);
    }

    // ❌ DELETE ORDER (optional)
    async deleteOrder(id: string) {
        const order = await this.orderRepo.findById(id);

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderRepo.removeOrder(id);

        return { message: 'Order deleted successfully' };
    }
}