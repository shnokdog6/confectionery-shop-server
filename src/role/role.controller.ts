import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { RoleService } from "@/role/role.service";
import { CreateRoleDto } from "@/role/dto/CreateRoleDto";
import { AddRolesDto } from "@/role/dto/AddRolesDto";
import { DeleteRoleDto } from "@/role/dto/DeleteRoleDto";
import { EditRoleDto } from "@/role/dto/EditRoleDto";
import { GetRolesDto } from "@/role/dto/GetRolesDto";
import { Role, UserRoles } from "@/role/role.model";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    public async get(@Query() dto: GetRolesDto): Promise<UserRoles[] | Role[]> {
        return this.roleService.get(dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async create(@Body() dto: CreateRoleDto) {
        await this.roleService.create(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Delete()
    public async delete(@Body() dto: DeleteRoleDto) {
        await this.roleService.delete(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Patch()
    public async update(@Body() dto: EditRoleDto) {
        await this.roleService.update(dto);
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
