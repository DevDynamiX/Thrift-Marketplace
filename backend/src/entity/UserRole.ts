// backend/src/entity/UserRole.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}