import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "@/user/user.model";
import { UserController } from "./user.controller";

@Module({
    imports: [SequelizeModule.forFeature([UserModel])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
