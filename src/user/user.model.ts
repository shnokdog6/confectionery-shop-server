import {
    BelongsToMany,
    Column,
    HasOne,
    Model,
    Table,
} from "sequelize-typescript";
import { UUID, UUIDV4 } from "sequelize";
import { Optional } from "sequelize";
import { Basket } from "@/basket/basket.model";
import { Role } from "@/role/role.model";
import { UserRoles } from "@/user-roles/user-roles.model";

export interface UserAttributes {
    id: string;
    phoneNumber: string;
    password: string;
    refreshToken: string | null;
}

export interface UserCreateAttributes
    extends Optional<UserAttributes, "id" | "refreshToken"> {}

@Table({ timestamps: false })
export class UserModel extends Model<UserAttributes, UserCreateAttributes> {
    @Column({
        type: UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id: string;

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
