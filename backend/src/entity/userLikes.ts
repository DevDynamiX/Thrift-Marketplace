import {Entity,JoinColumn, PrimaryGeneratedColumn, Column, Unique, ManyToOne} from "typeorm";
import {Inventory} from "./adminInventory";
import {User} from "./User";

let primaryGeneratedColumn = PrimaryGeneratedColumn();
@Entity()
@Unique(['id', 'unit'])
export class Likes {
    //like id
    @primaryGeneratedColumn
    id!: number;

    //user ID
    @ManyToOne(() => User, (user) => user.Likes)
    @JoinColumn({name: 'userId'})
    user!: User;

    @ManyToOne(() => Inventory, (inventory) => inventory.likes, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'unitId'})
    unit!: Inventory;
}