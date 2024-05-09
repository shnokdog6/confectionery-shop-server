import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Category} from "@/category/category.model";

export interface ProductAttributes {
    name: string;
    preview: string;
    cost: number;
}

export interface ProductCreateAttributes extends ProductAttributes {
}

@Table({timestamps: false})
export class Product extends Model<ProductAttributes, ProductCreateAttributes> {
    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    preview: string;

    @Column({allowNull: false})
    cost: number;

    @BelongsToMany(() => Category, {through: {model: () => ProductCategories}})
    categories: Category[];
}

export interface ProductCategoriesAttributes {
    productID: number;
    categoryID: number;
}

export interface ProductCategoriesCreateAttributes extends ProductCategoriesAttributes {
}

@Table({timestamps: false})
export class ProductCategories extends Model<ProductCategoriesAttributes, ProductCategoriesCreateAttributes> {
    @ForeignKey(() => Product)
    @Column
    productID: number;

    @ForeignKey(() => Category)
    @Column
    categoryID: number;
}
