import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    user!: User;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true,
    })
    items!: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount!: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status!: OrderStatus;
}