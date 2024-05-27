import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { BasketService } from "@/basket/basket.service";
import { addToBasketDto } from "@/basket/dto/addToBasketDto";

@Controller('basket')
export class BasketController {

    constructor(
        private basketService: BasketService
    ) {
    }

    @UseGuards(JwtAccessGuard)
    @Get(":userID")
    public async getAll(@Param("userID") userID: number) {
        return this.basketService.getAll(userID);
    }

    @UseGuards(JwtAccessGuard)
    @Post()
    public async add(@Body() dto: addToBasketDto) {
        //console.log(dto);
        return this.basketService.add(dto);
    }

}
