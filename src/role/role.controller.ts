import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { RoleService } from "@/role/role.service";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { Role } from "@/role/role.model";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    public async get(): Promise<Role[]> {
        return this.roleService.get();
    }

    @HttpCode(HttpStatus.OK)
    @Post("/give")
    public async addRolesToUser(@Body() dto: AddRolesDto) {
        await this.roleService.addRolesToUser(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("/take")
    public async removeRolesFromUser(@Body() dto: AddRolesDto) {
        await this.roleService.removeRolesFromUser(dto);
    }
}
