import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    itemName!: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: false, default: 0 })
    itemPrice!: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    cart!: Cart;
}