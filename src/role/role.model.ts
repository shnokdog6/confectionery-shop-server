import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { UserModel } from "@/user/user.model";
import { UserRoles } from "@/user-roles/user-roles.model";

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
