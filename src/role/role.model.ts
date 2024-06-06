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

export interface RoleAttributes {
    id: number;
    name: string;
}

export interface RoleCreateAttributes extends Optional<RoleAttributes, "id"> {}

@Table({ timestamps: false })
export class Role extends Model<RoleAttributes, RoleCreateAttributes> {
    @Column({ allowNull: false, unique: true })
    name: string;

    @BelongsToMany(() => UserModel, () => UserRoles)
    users: UserModel[];
}

export interface UserRolesAttributes {
    roleID: number;
    userID: number;
}

export interface UserRolesCreateAttributes extends UserRolesAttributes {}

@Table({ timestamps: false })
export class UserRoles extends Model<
    UserRolesAttributes,
    UserRolesCreateAttributes
> {
    @ForeignKey(() => Role)
    @Column({ allowNull: false })
    roleID: number;

    @BelongsTo(() => Role)
    role: Role;

    @ForeignKey(() => UserModel)
    @Column({ allowNull: false })
    userID: number;

    @BelongsTo(() => UserModel)
    user: UserModel;
}
