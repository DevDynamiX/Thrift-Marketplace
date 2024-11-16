import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {Likes} from "./userLikes";
import {Discounts} from "./Discounts";
import {User} from "./User";

@Entity()
export class Recycling {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false})
    email!: string;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ type: 'text', nullable: false })
    lastName!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ nullable: false })
    dropoffLocation!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    //creating discount ID
    @OneToMany(() => Discounts, (Discounts) => Discounts.recycling)
    discounts?: Discounts[];

    //link user ID to user table
    @ManyToOne(() => User, (user) => user.Recycling, {onDelete: "SET NULL"})
    @JoinColumn({name: 'userId'})
    user!: User;

}
