import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { Recycling} from "./Recycling";
import {User} from "./User";

@Entity()
export class Discounts {
    //discountID
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    discountCode!: string;

    //relation with user table
    @ManyToOne(() => User, (user) => user.Discounts)
    @JoinColumn({name: 'userId'})
    user!: User;

    @ManyToOne(() => Recycling, (Recycling) => Recycling.discounts)
    @JoinColumn({name: 'recyclingId'})
    recycle!: Recycling;


}
