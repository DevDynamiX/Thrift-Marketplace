import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from './UserRole';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    username!: string;

    @ManyToOne(() => UserRole)
    @JoinColumn({ name: 'roleId' })
    role!: UserRole;
}
