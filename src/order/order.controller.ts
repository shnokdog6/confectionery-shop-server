import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { OrderService } from "@/order/order.service";
import { CreateOrderDto } from "@/order/dto/CreateOrderDto";
import { Roles, RolesGuard } from "@/role/role.guard";
import { RoleType } from "@/role/role.enum";
import { JwtAccessGuard } from "@/auth/strategy/access.strategy";
import { User } from "@/user/user.decorator";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";

@Controller({ path: "order", version: "1" })
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Roles([RoleType.ADMIN])
    @UseGuards(JwtAccessGuard)
    @Get("/all")
    public async getAll() {
        return this.orderService.getAll();
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard)
    @Get()
    public async get(@User() user: JwtPayloadDto) {
        return this.orderService.get(user);
    }

    @Roles([RoleType.USER])
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Post()
    public async create(
        @User() user: JwtPayloadDto,
        @Body() dto: CreateOrderDto,
    ) {
        return this.orderService.create({ ...dto, userID: user.id });
    }
}
