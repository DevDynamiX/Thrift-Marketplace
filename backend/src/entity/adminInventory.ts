import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    //TODO: Change to null when can be fetched from Session
    @Column({ nullable: true })
    adminID?: string;

    @Column({ nullable: false, unique: true })
    SKU!: string;

    @Column({ nullable: false })
    itemName!: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: false, default: 0 })
    itemPrice!: number;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ nullable: false })
    category!: string;

    @Column({ length: 3, nullable: false })
    size!: string;

    @Column({ nullable: false })
    colour!: string;

    @Column({ nullable: false })
    sex!: string;

    @Column({ nullable: false })
    damage!: string;

    @Column({ nullable: false })
    material!: string;

    @Column({ default: false, nullable: true })
    onSale!: boolean;

    @Column("decimal", { precision: 10, scale: 2,  nullable: true })
    salePrice?: number;

    @Column({ type: 'float', nullable: true })
    discountPercent?: number;

    //TODO: reset to nullable: false
    @Column({ type: 'text', nullable: true })
    mainImage?: string;

    @Column({ type: 'text', nullable: true })
    image2?: string;

    @Column({ type: 'text', nullable: true })
    image3?: string;

}
