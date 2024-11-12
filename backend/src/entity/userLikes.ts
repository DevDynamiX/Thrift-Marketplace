import {Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne} from "typeorm";
import {Inventory} from "./adminInventory";

let primaryGeneratedColumn = PrimaryGeneratedColumn();
@Entity()
@Unique(['id', 'unit'])
export class Likes {
    //like id
    @primaryGeneratedColumn
    id!: number;

    //user ID
    @Column()
    userID!: string;

    @ManyToOne(() => Inventory)
    unit!: Inventory;
}