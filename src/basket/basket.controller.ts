import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { BasketService } from "@/basket/basket.service";
import { addToBasketDto } from "@/basket/dto/addToBasketDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { User } from "@/user/user.decorator";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";

@Controller("basket")
export class BasketController {
    constructor(private basketService: BasketService) {}

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Get(":userID")
    public async get(@User() user: JwtPayloadDto) {
        return this.basketService.get(user.id);
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async add(@User() user: JwtPayloadDto, @Body() dto: addToBasketDto) {
        return this.basketService.add({ ...dto, userID: user.id });
    }
}
