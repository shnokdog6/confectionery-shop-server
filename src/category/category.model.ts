import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { Product, ProductCategories } from "@/product/product.model";

export interface CategoryAttributes {
    name: string;
}

export interface CategoryCreateAttributes extends CategoryAttributes {}

@Table({ timestamps: false })
export class Category extends Model<
    CategoryAttributes,
    CategoryCreateAttributes
> {
    @Column({ allowNull: false })
    name: string;

    @BelongsToMany(() => Product, () => ProductCategories)
    products: Product[];
}
