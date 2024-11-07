import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {CartItem} from './CartItem'
@Entity()

export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => CartItem, (item) => item.cart,{cascade:true})
    items!: CartItem[];
}