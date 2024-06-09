import {
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Optional, UUID } from "sequelize";
import { UserModel } from "@/user/user.model";
import { Product } from "@/product/product.model";
import { ProductsInOrder } from "@/products-in-order/products-in-order.model";

export interface OrderAttributes {
    id: number;
    userID: string;
    sum: number;
}

export interface OrderCreateAttributes
    extends Optional<OrderAttributes, "id"> {}

@Table
export class Order extends Model<OrderAttributes, OrderCreateAttributes> {
    @ForeignKey(() => UserModel)
    @Column({ type: UUID })
    userID: string;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @Column({ allowNull: false })
    sum: number;

    @BelongsToMany(() => Product, () => ProductsInOrder)
    products: Product[];
}
