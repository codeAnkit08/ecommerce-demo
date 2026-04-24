import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column({nullable: true})
  description!: string;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  // product.entity.ts

  @Column({ nullable: true })
  imageKey!: string;
}