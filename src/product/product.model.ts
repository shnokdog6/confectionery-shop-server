import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Category } from "@/category/category.model";
import { Optional } from "sequelize";

export interface ProductAttributes {
    id: number;
    name: string;
    preview: string;
    cost: number;
    categories: number[];
}

export interface ProductCreateAttributes extends Optional<ProductAttributes, "id"> {
}

@Table({ timestamps: false })
export class Product extends Model<ProductAttributes, ProductCreateAttributes> {
    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    preview: string;

    @Column({ allowNull: false })
    cost: number;

    @BelongsToMany(() => Category, { through: { model: () => ProductCategories } })
    categories: Category[];
}

export interface ProductCategoriesAttributes {
    productID: number;
    categoryID: number;
}

export interface ProductCategoriesCreateAttributes extends ProductCategoriesAttributes {
}

@Table({ timestamps: false })
export class ProductCategories extends Model<ProductCategoriesAttributes, ProductCategoriesCreateAttributes> {
    @ForeignKey(() => Product)
    @Column
    productID: number;

    @ForeignKey(() => Category)
    @Column
    categoryID: number;
}
