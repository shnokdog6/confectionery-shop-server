import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    UseGuards,
} from "@nestjs/common";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { BasketService } from "@/basket/basket.service";
import { AddToBasketDto } from "@/basket/dto/AddToBasketDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { User } from "@/user/user.decorator";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { DeleteFromBasketDto } from "@/basket/dto/DeleteFromBasketDto";

@Controller("basket")
export class BasketController {
    constructor(private basketService: BasketService) {}

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Get()
    public async get(@User() user: JwtPayloadDto) {
        return this.basketService.get(user.id);
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Patch()
    public async add(@User() user: JwtPayloadDto, @Body() dto: AddToBasketDto) {
        return this.basketService.add({ ...dto, userID: user.id });
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Delete()
    public async delete(
        @User() user: JwtPayloadDto,
        @Body() dto: DeleteFromBasketDto,
    ) {
        return this.basketService.delete({ ...dto, userID: user.id });
    }
}
