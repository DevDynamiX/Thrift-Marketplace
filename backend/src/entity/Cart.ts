import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventory} from "./adminInventory";

@Entity()

export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userID!: string;

    @Column()
    itemID!: string;

    @ManyToOne(() => Inventory, (inventory) => inventory.cartItems)
    inventoryItem!: Inventory;
}
