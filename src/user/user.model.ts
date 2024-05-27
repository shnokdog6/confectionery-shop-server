import { BelongsToMany, Column, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { Product } from "@/product/product.model";
import { Basket } from "@/basket/basket.model";

export interface UserAttributes {
    id: number;
    phoneNumber: string;
    password: string;
    refreshToken: string | null;
}

export interface UserCreateAttributes extends Optional<UserAttributes, "id"> {
}

@Table({ timestamps: false })
export class User extends Model<UserAttributes, UserCreateAttributes> {
    @Column({ unique: true, allowNull: false })
    phoneNumber: string;

    @Column({ allowNull: false })
    password: string;

    @Column
    refreshToken: string;

    @HasOne(() => Basket)
    basket: Basket;
}