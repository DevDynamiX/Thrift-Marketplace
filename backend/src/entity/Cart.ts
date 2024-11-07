import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems?: CartItem[];
}