import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "@/user/user.model";
import { UserController } from "./user.controller";
import { UserRoles } from "@/user-roles/user-roles.model";

@Module({
    imports: [SequelizeModule.forFeature([UserModel, UserRoles])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
