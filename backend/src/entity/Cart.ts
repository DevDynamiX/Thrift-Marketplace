import {Entity, ManyToOne, PrimaryGeneratedColumn, Column, Unique, JoinColumn} from 'typeorm';
import { Inventory } from "./adminInventory";
import {User} from "./User";

let primaryGeneratedColumn = PrimaryGeneratedColumn();

@Entity()
@Unique(['id', 'inventoryItem'])
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.Cart)
    @JoinColumn({name: 'userID'})
    user!: User;

    @ManyToOne(() => Inventory, (inventory) => inventory.likes, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'inventoryItemId'})
    inventoryItem!: Inventory;
}
