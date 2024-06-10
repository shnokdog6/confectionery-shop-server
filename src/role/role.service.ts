import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "@/role/role.model";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { UserService } from "@/user/user.service";
import { RemoveRolesDto } from "@/role/dto/RemoveRolesDto";
import { JwtService } from "@/jwt/jwt.service";
import { UserRoles } from "@/user-roles/user-roles.model";
import { MD5 } from "object-hash";

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role)
        private readonly roleModel: typeof Role,
        @InjectModel(UserRoles)
        private readonly userRolesModel: typeof UserRoles,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async get(): Promise<Role[]> {
        return this.roleModel.findAll();
    }

    public async addRolesToUser(dto: AddRolesDto): Promise<void> {
        const user = await this.userService.getByID(dto.userID);
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
                userID: user.id,
                roleID: role,
            });
        }

        const userRoles = await this.userService.getRoles(user.id);
        await this.jwtService.setCurrentPayload({
            id: user.id,
            roles: userRoles.map((role) => role.id),
        });
    }

    public async removeRolesFromUser(dto: RemoveRolesDto): Promise<void> {
        const user = await this.userService.getByID(dto.userID);
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

        const destroyedCount = await this.userRolesModel.destroy({
            where: {
                userID: user.id,
                roleID: dto.roles,
            },
        });
        if (!destroyedCount) return;

        const userRoles = await this.userService.getRoles(user.id);
        await this.jwtService.setCurrentPayload({
            id: user.id,
            roles: userRoles.map((role) => role.id),
        });
    }
}
