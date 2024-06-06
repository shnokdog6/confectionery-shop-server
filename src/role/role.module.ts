import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Role, UserRoles } from "@/role/role.model";
import { UserModule } from "@/user/user.module";

@Module({
    imports: [SequelizeModule.forFeature([Role, UserRoles]), UserModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
