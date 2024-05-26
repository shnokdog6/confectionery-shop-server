import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "@/user/user.module";
import { JwtConfiguredModule } from "@/jwt/jwt.module";
import { PassportModule } from "@nestjs/passport";
import { AccessTokenStrategy } from "@/auth/strategy/access.strategy";
import { RefreshTokenStrategy } from "@/auth/strategy/refresh.strategy";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtConfiguredModule,
    ],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
    controllers: [AuthController],
})
export class AuthModule {
}
