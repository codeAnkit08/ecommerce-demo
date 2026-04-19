import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { CartItemRepository } from 'src/cart/cart-item.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Order,OrderItem])],
    controllers: [OrdersController],
    providers: [OrdersService,OrderRepository,CartRepository,CartItemRepository],
})
export class OrdersModule {}
