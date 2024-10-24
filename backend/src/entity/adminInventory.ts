import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    adminID!: string;

    @Column({ nullable: false, unique: true })
    SKU!: string;

    @Column({ nullable: false })
    itemName!: string;

    @Column("decimal", { precision: 10, scale: 2, nullable: false })
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

    @Column("decimal", { precision: 10, scale: 2, default: false, nullable: true })
    salePrice!: number;

    @Column({ type: 'float', default: false, nullable: true })
    discountPercent!: number;

    @Column({ type: 'text', nullable: false })
    mainImage!: string;

    @Column({ type: 'text', nullable: false })
    image2!: string;

    @Column({ type: 'text', nullable: false })
    image3!: string;

    // Function will override original price if sale price is set
    getFinalPrice(): number {
        return this.onSale && this.salePrice ? this.salePrice : this.itemPrice;
    }
}
