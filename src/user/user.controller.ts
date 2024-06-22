import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { CreateUserDto } from "@/user/dto/CreateUserDto";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { GetUserDto } from "@/user/dto/GetUserDto";

@Controller({ path: "user", version: "1" })
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAccessGuard, RolesGuard)
    @Get()
    public async get(@Query() dto: GetUserDto) {
        return this.userService.get(dto);
    }

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }
}
