import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { UserModel } from "@/user/user.model";
import { Role } from "@/role/role.model";

export interface UserRolesAttributes {
    roleID: number;
    userID: string;
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
    userID: string;

    @BelongsTo(() => UserModel)
    user: UserModel;
}
