import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SequelizeConfiguredModule} from "@/sequelize";
import {CategoryModule} from "@/category/category.module";
import {ProductModule} from "@/product/product.module";
import { UserModule } from '@/user/user.module';
import { AuthModule } from "@/auth/auth.module";


@Module({
  imports: [
      SequelizeConfiguredModule,
      CategoryModule,
      ProductModule,
      UserModule,
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
