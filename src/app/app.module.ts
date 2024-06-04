import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeConfiguredModule } from "@/sequelize";
import { CategoryModule } from "@/category/category.module";
import { ProductModule } from "@/product/product.module";
import { UserModule } from "@/user/user.module";
import { AuthModule } from "@/auth/auth.module";
import { BasketModule } from "@/basket/basket.module";
import { OrderModule } from "@/order/order.module";
import { RoleModule } from "@/role/role.module";

@Module({
    imports: [
        SequelizeConfiguredModule,
        CategoryModule,
        ProductModule,
        UserModule,
        AuthModule,
        BasketModule,
        OrderModule,
        RoleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
