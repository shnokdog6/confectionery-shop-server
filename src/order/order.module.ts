import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "@/order/order.model";
import { ProductModule } from "@/product/product.module";
import { ProductsInOrder } from "@/products-in-order/products-in-order.model";
import { OrderStatusModel } from "@/order-status/order-status.model";

@Module({
    imports: [
        SequelizeModule.forFeature([Order, OrderStatusModel, ProductsInOrder]),
        ProductModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
