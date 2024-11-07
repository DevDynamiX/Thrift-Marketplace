import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {User} from "./User";

@Entity() // table orders
export class Orders {
    @PrimaryGeneratedColumn()
    orderNumber!: number;

    @Column()
    email!: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: false, default: 0 })
    total!: number;

    @CreateDateColumn()
    CreateDate!: Date;
}