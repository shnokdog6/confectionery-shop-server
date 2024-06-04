import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role, UserRoles } from "@/role/role.model";
import { CreateRoleDto } from "@/role/dto/CreateRoleDto";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { UserService } from "@/user/user.service";
import { DeleteRoleDto } from "@/role/dto/DeleteRoleDto";
import { EditRoleDto } from "@/role/dto/EditRoleDto";
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

    public async get(dto: GetRolesDto): Promise<UserRoles[] | Role[]> {
        if (dto.userID) {
            return this.userRolesModel.findAll({
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
            });
        }
        return this.roleModel.findAll();
    }

    public async create(dto: CreateRoleDto): Promise<void> {
        const role = await this.roleModel.findOne({
            where: {
                name: dto.name,
            },
        });
        if (role) {
            throw new BadRequestException("Роль уже существует");
        }
        await this.roleModel.create(dto);
    }

    public async delete(dto: DeleteRoleDto): Promise<void> {
        await this.roleModel.destroy({
            where: {
                id: dto.id,
            },
        });
    }

    public async update({ id, ...dto }: EditRoleDto): Promise<void> {
        const role = await this.roleModel.findByPk(id);
        if (!role) {
            throw new BadRequestException("Роль не существует");
        }
        await role.update(dto);
    }

    public async addRolesToUser(dto: AddRolesDto): Promise<void> {
        const user = await this.userService.getById(dto.userID);
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
        const user = await this.userService.getById(dto.userID);
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
