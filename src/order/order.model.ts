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
import { OrderStatusModel } from "@/order-status/order-status.model";
import { OrderStatus } from "@/order-status/order-status.enum";

export interface OrderAttributes {
    id: number;
    userID: string;
    sum: number;
    statusID: OrderStatus;
}

export interface OrderCreateAttributes
    extends Optional<OrderAttributes, "id"> {}

@Table
export class Order extends Model<OrderAttributes, OrderCreateAttributes> {
    @ForeignKey(() => UserModel)
    @Column({ type: UUID })
    userID: string;

    @ForeignKey(() => OrderStatusModel)
    @Column({ allowNull: false })
    statusID: number;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @Column({ allowNull: false })
    sum: number;

    @BelongsToMany(() => Product, () => ProductsInOrder)
    products: Product[];

    @BelongsTo(() => OrderStatusModel)
    status: OrderStatusModel;
}
