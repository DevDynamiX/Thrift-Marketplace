import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserRole } from './UserRole';

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

    @ManyToOne(() => UserRole)
    @JoinColumn({ name: 'UserRole' })
    UserRole!: UserRole;
}