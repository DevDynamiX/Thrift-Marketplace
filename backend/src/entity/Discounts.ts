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

    @Column({ default: false, nullable: true })
    isUsed!: boolean;

    //relation with user table
    @ManyToOne(() => User, (user) => user.discounts, {onDelete:'SET NULL'})
    @JoinColumn({name: 'userId'})
    user!: User;

    @ManyToOne(() => Recycling, (Recycling) => Recycling.discounts, {onDelete:'SET NULL'})
    @JoinColumn({name: 'recyclingId'})
    recycling!: Recycling;
}
