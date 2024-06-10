import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Product } from "@/product/product.model";
import { Basket } from "@/basket/basket.model";

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
