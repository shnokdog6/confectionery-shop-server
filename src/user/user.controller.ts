import { BadRequestException, Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { createUserDto } from "@/user/dto/createUserDto";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";

@Controller("user")
export class UserController {

    constructor(
        private userService: UserService
    ) {
    }

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
        try {
            return this.userService.create(dto);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

}
