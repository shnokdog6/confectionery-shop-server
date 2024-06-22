import { Module } from "@nestjs/common";
import { CategoryModule } from "@/category/category.module";
import { ProductModule } from "@/product/product.module";
import { UserModule } from "@/user/user.module";
import { AuthModule } from "@/auth/auth.module";
import { BasketModule } from "@/basket/basket.module";
import { OrderModule } from "@/order/order.module";
import { RoleModule } from "@/role/role.module";
import { SequelizeModule } from "@/sequelize/sequelize.module";

@Module({
    imports: [
        SequelizeModule,
        CategoryModule,
        ProductModule,
        UserModule,
        AuthModule,
        BasketModule,
        OrderModule,
        RoleModule,
    ],
})
export class AppModule {}
