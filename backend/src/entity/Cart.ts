import {Entity, ManyToOne, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';
import { Inventory} from "./adminInventory";

let primaryGeneratedColumn = PrimaryGeneratedColumn();

@Entity()
@Unique(['id', 'inventoryItem'])
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userID!: string;

    @ManyToOne(() => Inventory)
    inventoryItem!: Inventory;
}
