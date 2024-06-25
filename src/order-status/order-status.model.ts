import { BelongsTo, Column, HasMany, Model, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Order, OrderAttributes } from "@/order/order.model";

export interface OrderStatusAttributes {
    id: number;
    name: string;
}

export interface OrderStatusCreationAttributes
    extends Optional<OrderAttributes, "id"> {}

@Table({ timestamps: false })
export class OrderStatusModel extends Model<
    OrderStatusAttributes,
    OrderStatusCreationAttributes
> {
    @Column({ allowNull: false })
    name: string;

    @HasMany(() => Order)
    orders: Order[];
}
