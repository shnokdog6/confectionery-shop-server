import {
    BelongsToMany,
    Column,
    HasOne,
    Model,
    Table,
} from "sequelize-typescript";
import { Optional } from "sequelize";
import { Basket } from "@/basket/basket.model";
import { Role, UserRoles } from "@/role/role.model";

export interface UserAttributes {
    id: number;
    phoneNumber: string;
    password: string;
    refreshToken: string | null;
}

export interface UserCreateAttributes
    extends Optional<UserAttributes, "id" | "refreshToken"> {}

@Table({ timestamps: false })
export class UserModel extends Model<UserAttributes, UserCreateAttributes> {
    @Column({ unique: true, allowNull: false })
    phoneNumber: string;

    @Column({ allowNull: false })
    password: string;

    @Column
    refreshToken: string;

    @HasOne(() => Basket)
    basket: Basket;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
}
