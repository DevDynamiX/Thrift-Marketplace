import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Recycling {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    userID?: string;

    @Column({ nullable: false, unique: true })
    email!: string;

    @Column({ nullable: false })
    firstName!: string;

    @Column({ type: 'text', nullable: false })
    lastName!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ length: 3, nullable: false })
    dropoffLocation!: string;

    //TODO: SEE IF CAN ADD
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;
}
