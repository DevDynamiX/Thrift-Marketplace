import {Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm";

let primaryGeneratedColumn = PrimaryGeneratedColumn();
@Entity()
@Unique(['id', 'itemID'])
export class Likes {
    //like id
    @primaryGeneratedColumn
    id!: number;

    //user ID
     @Column()
     userID!: string;

    //itemID
    @Column()
    itemID!: string;

}