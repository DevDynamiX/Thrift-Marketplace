// backend/src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserRole } from './UserRole';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true, unique: true })
    firebaseUid: string;

    @ManyToOne(() => UserRole)
    role: UserRole;
}
