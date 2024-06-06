import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { createUserDto } from "@/user/dto/createUserDto";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Roles([RoleType.ADMIN])
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessGuard)
    @Get()
    public async getAll() {
        return this.userService.getAll();
    }

    @Get(":phoneNumber")
    public async getByPhoneNumber(phoneNumber: string) {
        return this.userService.getByPhoneNumber(phoneNumber);
    }

    @Post()
    public async create(@Body() dto: createUserDto) {
        return this.userService.create(dto);
    }
}
