import { Entity, OneToMany,PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserRole } from './UserRole';
import { Likes} from "./userLikes";
import { Cart } from "./Cart";
import { Recycling } from "./Recycling";
import { Discounts } from "./Discounts";

let primaryGeneratedColumn = PrimaryGeneratedColumn();

@Entity()
export class User {
    @primaryGeneratedColumn
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column()
    gender?: string;

    //for user role table
    @ManyToOne(() => UserRole)
    @JoinColumn({ name: 'UserRole' })
    UserRole!: UserRole;

    // For Likes table
    @OneToMany(() => Likes, (Likes) => Likes.user, {onDelete: 'CASCADE' })
    Likes!: Likes[];

    // For Cart table
    @OneToMany(() => Cart, (Cart) => Cart.user, {onDelete: 'CASCADE' })
    Cart!: Cart[];

    // For Recycling table
    @OneToMany(() => Recycling, (Recycling) => Recycling.user, {onDelete: 'CASCADE' })
    Recycling!: Recycling[];

    // For Discounts table
    @OneToMany(() => Discounts, (discounts) => discounts.user, {onDelete: 'CASCADE' })
    discounts!: Discounts[];
}