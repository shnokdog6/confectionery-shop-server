import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role, UserRoles } from "@/role/role.model";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { UserService } from "@/user/user.service";
import { RemoveRolesDto } from "@/role/dto/RemoveRolesDto";
import { GetRolesDto } from "@/role/dto/GetRolesDto";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role)
        private readonly roleModel: typeof Role,
        @InjectModel(UserRoles)
        private readonly userRolesModel: typeof UserRoles,
        private readonly userService: UserService,
    ) {}

    public async get(dto: GetRolesDto): Promise<Role[]> {
        if (dto.userID) {
            return (await this.userRolesModel.findAll({
                include: {
                    model: Role,
                    attributes: [],
                },
                where: {
                    userID: dto.userID,
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
        return this.roleModel.findAll();
    }

    public async addRolesToUser(dto: AddRolesDto): Promise<void> {
        const user = await this.userService.get({ id: dto.userID });
        if (!user) {
            throw new BadRequestException("Пользователя не существует");
        }

        const roles = await this.roleModel.findAll({
            where: {
                id: dto.roles,
            },
        });
        if (roles.length !== dto.roles.length) {
            throw new BadRequestException("Указана не существующая роль");
        }

        for (const role of dto.roles) {
            await this.userRolesModel.create({
                userID: dto.userID,
                roleID: role,
            });
        }
    }

    public async removeRolesFromUser(dto: RemoveRolesDto): Promise<void> {
        const user = await this.userService.get({ id: dto.userID });
        if (!user) {
            throw new BadRequestException("Пользователя не существует");
        }
        const roles = await this.roleModel.findAll({
            where: {
                id: dto.roles,
            },
        });
        if (roles.length !== dto.roles.length) {
            throw new BadRequestException("Указана не существующая роль");
        }
        await this.userRolesModel.destroy({
            where: {
                userID: dto.userID,
                roleID: dto.roles,
            },
        });
    }
}
