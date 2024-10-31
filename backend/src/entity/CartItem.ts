import {Entity,PrimaryGeneratedColumn,Column,ManyToOne} from "typeorm";
import {Cart} from "./Cart";

@Entity()
export class CartItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @Column('int')
    quantity: number;

    @ManyToOne(()=>Cart,(cart)=>cart.items)
    cart: Cart;
}
