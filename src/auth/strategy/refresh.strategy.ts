import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import cookie from "cookie";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-refresh",
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                RefreshTokenStrategy.jwtFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: "refresh",
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
