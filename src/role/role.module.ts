import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Role } from "@/role/role.model";
import { UserModule } from "@/user/user.module";
import { RedisModule } from "@/redis/redis.module";
import { UserRoles } from "@/user-roles/user-roles.model";
import { JwtModule } from "@/jwt/jwt.module";

@Module({
    imports: [
        SequelizeModule.forFeature([Role, UserRoles]),
        UserModule,
        RedisModule,
        JwtModule,
    ],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
