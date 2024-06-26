import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Product } from "@/product/product.model";
import { Order } from "@/order/order.model";

export interface ProductsInOrderAttributes {
    orderID: number;
    productID: number;
    count: number;
}

export interface ProductsInOrderCreateAttributes
    extends ProductsInOrderAttributes {}

@Table({ timestamps: false })
export class ProductsInOrder extends Model<
    ProductsInOrderAttributes,
    ProductsInOrderCreateAttributes
> {
    @ForeignKey(() => Order)
    @Column({ allowNull: false })
    orderID: number;

    @BelongsTo(() => Order)
    order: Order;

    @ForeignKey(() => Product)
    @Column({ allowNull: false })
    productID: number;

    @BelongsTo(() => Product)
    product: Product;

    @Column({ allowNull: false, defaultValue: 1 })
    count: number;
}
