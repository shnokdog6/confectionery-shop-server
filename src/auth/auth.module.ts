import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "@/user/user.module";
import { JwtModule } from "@/jwt/jwt.module";
import { PassportModule } from "@nestjs/passport";
import { AccessTokenStrategy } from "@/auth/strategy/access.strategy";
import { RefreshTokenStrategy } from "@/auth/strategy/refresh.strategy";
import { RoleModule } from "@/role/role.module";
import { RedisModule } from "@/redis/redis.module";
import { ConfigModule } from "@/config/config.module";

@Module({
    imports: [
        ConfigModule,
        UserModule,
        RoleModule,
        PassportModule,
        JwtModule,
        RedisModule,
    ],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
