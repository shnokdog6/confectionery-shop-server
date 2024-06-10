import {
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Product } from "@/product/product.model";
import { UserModel } from "@/user/user.model";
import { Optional, UUID } from "sequelize";
import { ProductsInBasket } from "@/products-in-basket/products-in-basket.model";

export interface BasketAttributes {
    id: number;
    userID: string;
}

export interface BasketCreateAttributes
    extends Optional<BasketAttributes, "id"> {}

@Table({ timestamps: false })
export class Basket extends Model<BasketAttributes, BasketCreateAttributes> {
    @ForeignKey(() => UserModel)
    @Column({ type: UUID })
    userID: string;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @BelongsToMany(() => Product, () => ProductsInBasket)
    products: Product[];
}
