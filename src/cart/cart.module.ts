import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { CartController } from './cart.controller';
import { CartItemRepository } from './cart-item.repository';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { ProductsRepository } from 'src/products/products.repository';
import { S3Service } from 'src/common/s3/s3.service';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem]),
        ProductsModule, UsersModule],
    controllers: [CartController],
    providers: [CartRepository, CartItemRepository,CartService, ProductsRepository,S3Service],
    exports: [CartService]
})
export class CartModule { }
