import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "@/product/product.model";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { FileModule } from "@/file/file.module";
import { SequelizeConfiguredModule } from "@/sequelize";
import { ProductCategories } from "@/products-categories/product-categories.model";

@Module({
    imports: [
        SequelizeConfiguredModule,
        SequelizeModule.forFeature([Product, ProductCategories]),
        FileModule,
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
