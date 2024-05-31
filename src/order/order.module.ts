import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Order, ProductsInOrder } from "@/order/order.model";
import { ProductModule } from "@/product/product.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Order, ProductsInOrder]),
        ProductModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
