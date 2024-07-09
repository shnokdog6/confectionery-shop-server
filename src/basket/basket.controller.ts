import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { BasketService } from "@/basket/basket.service";
import { AddToBasketDto } from "@/basket/dto/AddToBasketDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { User } from "@/user/user.decorator";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { ReduceFromBasketDto } from "@/basket/dto/ReduceFromBasketDto";
import { DeleteFromBasketDto } from "@/basket/dto/DeleteFromBasketDto";
import { PatchProductDto } from "@/basket/dto/PatchProductDto";

@Controller({ path: "basket", version: "1" })
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
    @Post()
    public async add(@User() user: JwtPayloadDto, @Body() dto: AddToBasketDto) {
        return this.basketService.add({ ...dto, user });
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async reduce(
        @User() user: JwtPayloadDto,
        @Body() dto: ReduceFromBasketDto,
    ) {
        return this.basketService.reduce({ ...dto, user });
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Patch()
    public async patch(
        @User() user: JwtPayloadDto,
        @Body() dto: PatchProductDto,
    ) {
        return this.basketService.patch({ ...dto, user });
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Delete()
    public async delete(
        @User() user: JwtPayloadDto,
        @Body() dto: DeleteFromBasketDto,
    ) {
        return this.basketService.delete({ ...dto, user });
    }
}
