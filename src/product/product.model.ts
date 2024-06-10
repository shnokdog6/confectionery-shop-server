import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { Category } from "@/category/category.model";
import { Optional } from "sequelize";
import { Basket } from "@/basket/basket.model";
import { ProductCategories } from "@/products-categories/product-categories.model";
import { ProductsInOrder } from "@/products-in-order/products-in-order.model";
import { Order } from "@/order/order.model";
import { ProductsInBasket } from "@/products-in-basket/products-in-basket.model";

export interface ProductAttributes {
    id: number;
    name: string;
    preview: string;
    cost: number;
    categories: number[];
}

export interface ProductCreateAttributes
    extends Optional<ProductAttributes, "id"> {}

@Table({ timestamps: false })
export class Product extends Model<ProductAttributes, ProductCreateAttributes> {
    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    preview: string;

    @Column({ allowNull: false })
    cost: number;

    @BelongsToMany(() => Category, () => ProductCategories)
    categories: Category[];

    @BelongsToMany(() => Basket, () => ProductsInBasket)
    baskets: Basket[];

    @BelongsToMany(() => Order, () => ProductsInOrder)
    orders: Order[];
}
