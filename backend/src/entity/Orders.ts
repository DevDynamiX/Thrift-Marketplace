import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {User} from "./User"
@Entity()

export class Orders {
    @PrimaryGeneratedColumn()
    orderNumber!: number;

    @Column()
    email!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total!:number;

    @CreateDateColumn()
    CreateDate!: Date;

    @Column()
    address: string="";
}