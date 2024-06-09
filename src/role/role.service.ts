import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "@/role/role.model";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { UserService } from "@/user/user.service";
import { RemoveRolesDto } from "@/role/dto/RemoveRolesDto";
import { JwtService } from "@/jwt/jwt.service";
import { UserRoles } from "@/user-roles/user-roles.model";

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
                userID: dto.userID,
                roleID: role,
            });
        }

        await this.jwtService.makeTokenExpired(user.id);
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

        (await this.userRolesModel.destroy({
            where: {
                userID: dto.userID,
                roleID: dto.roles,
            },
        })) && (await this.jwtService.makeTokenExpired(user.id));
    }
}
