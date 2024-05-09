import {BelongsToMany, Column, Model, Table} from "sequelize-typescript";
import {Product, ProductCategories} from "@/product/product.model";

export interface CategoryAttributes {
    name: string;
}

export interface MessageCreateAttributes extends CategoryAttributes {}

@Table({timestamps: false})
export class Category extends Model<CategoryAttributes, MessageCreateAttributes> {
    @Column({allowNull: false})
    name: string;

    @BelongsToMany(() => Product, {through: {model: () => ProductCategories}})
    products: Product[];
}