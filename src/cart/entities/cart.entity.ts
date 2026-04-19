import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ✅ ADD THIS (VERY IMPORTANT)
  @Column({ name: 'userId' })
  userId!: string;

  // ✅ RELATION
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' }) // 🔥 MUST MATCH DB COLUMN
  user!: User;

  @OneToMany(() => CartItem, (item) => item.cart)
  items!: CartItem[];
}