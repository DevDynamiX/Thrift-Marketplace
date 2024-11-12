import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

let primaryGeneratedColumn = PrimaryGeneratedColumn();

@Entity()
export class User {
    @primaryGeneratedColumn
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    gender?: string;

    @Column()
    firebaseUid?: string;
}