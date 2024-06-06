import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

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
        return req.headers.cookie["refreshToken"];
    }

    public async validate(req: Request, payload: any) {
        const refreshToken = RefreshTokenStrategy.jwtFromCookie(req);
        return { ...payload, refreshToken };
    }
}

export const JwtRefreshGuard = AuthGuard("jwt-refresh");
