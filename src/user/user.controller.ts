import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { CreateUserDto } from "@/user/dto/CreateUserDto";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { GetUserDto } from "@/user/dto/GetUserDto";

@Controller("user")
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

    // @UseGuards(JwtAccessGuard, RolesGuard)
    // @Get(":id/roles")
    // public async getRoles(@User() user: JwtPayloadDto) {
    //     return this.userService.getRoles(user.id);
    // }
}
