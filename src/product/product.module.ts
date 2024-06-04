import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductCategories, Product } from "@/product/product.model";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { FileService } from "@/file/file.service";
import { FileModule } from "@/file/file.module";
import { SequelizeConfiguredModule } from "@/sequelize";

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
