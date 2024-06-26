import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Basket } from "@/basket/basket.model";
import { UserModule } from "@/user/user.module";
import { ProductModule } from "@/product/product.module";
import { ProductsInBasket } from "@/products-in-basket/products-in-basket.model";

@Module({
    imports: [
        SequelizeModule.forFeature([Basket, ProductsInBasket]),
        UserModule,
        ProductModule,
    ],
    providers: [BasketService],
    controllers: [BasketController],
})
export class BasketModule {}
