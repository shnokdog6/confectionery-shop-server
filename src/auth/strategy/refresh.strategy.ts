import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import cookie from "cookie";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh",
) {
    constructor(configService: ConfigService<EnvironmentVariables>) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RefreshTokenStrategy.jwtFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_REFRESH_KEY"),
            passReqToCallback: true,
        });
    }

    private static jwtFromCookie(req: Request): string | null {
        try {
            return cookie.parse(req.headers.cookie).refreshToken;
        } catch {
            throw new UnauthorizedException();
        }
    }

    public async validate(req: Request, payload: any) {
        const refreshToken = RefreshTokenStrategy.jwtFromCookie(req);
        return { ...payload, refreshToken };
    }
}

export const JwtRefreshGuard = AuthGuard("jwt-refresh");
