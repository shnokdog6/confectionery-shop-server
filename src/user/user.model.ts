import { Column, Model, Table } from "sequelize-typescript";
import { Optional } from "sequelize";

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
    @Column({ primaryKey: true, allowNull: false })
    phoneNumber: string;

    @Column({ allowNull: false })
    password: string;

    @Column
    refreshToken: string;
}