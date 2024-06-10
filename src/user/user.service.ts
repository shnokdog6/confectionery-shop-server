import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "@/user/dto/CreateUserDto";
import { InjectModel } from "@nestjs/sequelize";
import { UserModel } from "@/user/user.model";
import bcrypt from "bcrypt";
import { GetUserDto } from "@/user/dto/GetUserDto";
import { UserRoles } from "@/user-roles/user-roles.model";
import { Role } from "@/role/role.model";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel) private readonly userModel: typeof UserModel,
        @InjectModel(UserRoles)
        private readonly userRolesModel: typeof UserRoles,
    ) {}

    public async get(dto: GetUserDto) {
        return this.userModel.findAll({
            include: {
                model: Role,
                through: { attributes: [] },
            },
            where: {
                ...dto,
            },
        });
    }

    public async getByID(id: string) {
        return this.userModel.findByPk(id, {
            include: {
                model: Role,
                through: { attributes: [] },
            },
        });
    }

    public async getByPhoneNumber(phoneNumber: string) {
        return this.userModel.findOne({
            include: {
                model: Role,
                through: { attributes: [] },
            },
            where: {
                phoneNumber,
            },
        });
    }

    public async getRoles(id: string): Promise<Role[]> {
        return (await this.userRolesModel.findAll({
            include: {
                model: Role,
                attributes: [],
            },
            where: {
                userID: id,
            },
            attributes: {
                include: [
                    [Sequelize.col('"role"."id"'), "id"],
                    [Sequelize.col('"role"."name"'), "name"],
                ],
                exclude: ["roleID", "userID"],
            },
            raw: true,
        })) as unknown as Role[];
    }

    public async create(dto: CreateUserDto) {
        const user = await this.getByPhoneNumber(dto.phoneNumber);
        if (user) {
            throw new BadRequestException(
                "Пользоветель с таким номер существует",
            );
        }
        const passwordHash = await bcrypt.hash(dto.password, 3);
        return this.userModel.create({
            phoneNumber: dto.phoneNumber,
            password: passwordHash,
        });
    }
}
