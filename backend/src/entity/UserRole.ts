// backend/src/entity/UserRole.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}