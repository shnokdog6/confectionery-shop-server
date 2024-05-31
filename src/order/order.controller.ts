import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrderService } from "@/order/order.service";
import { createOrderDto } from "@/order/dto/createOrderDto";

@Controller("order")
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get()
    public async getAll() {
        return this.orderService.getAll();
    }

    @Post()
    public async create(@Body() dto: createOrderDto) {
        return this.orderService.create(dto);
    }
}
