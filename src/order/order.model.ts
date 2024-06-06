import {
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { UserModel } from "@/user/user.model";
import { Product } from "@/product/product.model";

export interface OrderAttributes {
    id: number;
    userID: number;
    sum: number;
}

export interface OrderCreateAttributes
    extends Optional<OrderAttributes, "id"> {}

@Table
export class Order extends Model<OrderAttributes, OrderCreateAttributes> {
    @ForeignKey(() => UserModel)
    @Column
    userID: number;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @Column({ allowNull: false })
    sum: number;

    @BelongsToMany(() => Product, () => ProductsInOrder)
    products: Product[];
}

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
