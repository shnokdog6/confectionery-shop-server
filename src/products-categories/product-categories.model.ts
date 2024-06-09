import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "@/category/category.model";
import { Product } from "@/product/product.model";

export interface ProductCategoriesAttributes {
    productID: number;
    categoryID: number;
}

export interface ProductCategoriesCreateAttributes
    extends ProductCategoriesAttributes {}

@Table({ timestamps: false })
export class ProductCategories extends Model<
    ProductCategoriesAttributes,
    ProductCategoriesCreateAttributes
> {
    @ForeignKey(() => Product)
    @Column
    productID: number;

    @ForeignKey(() => Category)
    @Column
    categoryID: number;
}
