import {
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Product } from "@/product/product.model";
import { User } from "@/user/user.model";
import { Optional } from "sequelize";

export interface BasketAttributes {
    id: number;
    userID: number;
}

export interface BasketCreateAttributes
    extends Optional<BasketAttributes, "id"> {}

@Table({ timestamps: false })
export class Basket extends Model<BasketAttributes, BasketCreateAttributes> {
    @ForeignKey(() => User)
    @Column
    userID: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Product, () => ProductsInBasket)
    products: Product[];
}

export interface ProductsInBasketAttributes {
    basketID: number;
    productID: number;
    count: number;
}

export interface ProductsInBasketCreateAttributes
    extends ProductsInBasketAttributes {}

@Table({ timestamps: false })
export class ProductsInBasket extends Model<
    ProductsInBasketAttributes,
    ProductsInBasketCreateAttributes
> {
    @ForeignKey(() => Basket)
    @Column
    basketID: number;

    @BelongsTo(() => Basket)
    basket: Basket;

    @ForeignKey(() => Product)
    @Column
    productID: number;

    @BelongsTo(() => Product)
    product: Product;

    @Column({ allowNull: false, defaultValue: 1 })
    count: number;
}
