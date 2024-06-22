import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Product } from "@/product/product.model";

export interface ProductDetailsAttributes {
    productID: number;
    description: string;
    compound: string;
}

export interface ProductDetailsCreationAttributes
    extends ProductDetailsAttributes {}

@Table({ timestamps: false })
export class ProductDetailsModel extends Model<
    ProductDetailsAttributes,
    ProductDetailsCreationAttributes
> {
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    compound: string;

    @ForeignKey(() => Product)
    @Column({ allowNull: false })
    productID: number;

    @BelongsTo(() => Product)
    product: Product;
}
