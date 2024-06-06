import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { OrderService } from "@/order/order.service";
import { createOrderDto } from "@/order/dto/createOrderDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { User } from "@/user/user.decorator";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";

@Controller("order")
export class OrderController {
    constructor(private orderService: OrderService) {}

    @UseGuards(JwtAccessGuard)
    @Get()
    public async get(@User() user: JwtPayloadDto) {
        return this.orderService.get(user);
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async create(@Body() dto: createOrderDto) {
        return this.orderService.create(dto);
    }
}
