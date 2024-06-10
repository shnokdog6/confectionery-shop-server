import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { RoleService } from "@/role/role.service";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { Role } from "@/role/role.model";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Get()
    public async get(): Promise<Role[]> {
        return this.roleService.get();
    }

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Post("/give")
    public async addRolesToUser(@Body() dto: AddRolesDto) {
        await this.roleService.addRolesToUser(dto);
    }

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Post("/take")
    public async removeRolesFromUser(@Body() dto: AddRolesDto) {
        await this.roleService.removeRolesFromUser(dto);
    }
}
