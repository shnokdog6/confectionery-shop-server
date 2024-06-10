import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { RedisService } from "@/redis/redis.service";
import { Request } from "express";
import { MD5 } from "object-hash";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    "jwt-access",
) {
    constructor(private readonly redisService: RedisService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "access",
            passReqToCallback: true,
        });
    }

    public async validate(req: Request, payload: JwtPayloadDto) {
        const currentHash = await this.redisService.getCurrentPayloadHash(
            payload.id,
        );

        if (!currentHash) return payload;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { iat, exp, ...dto } = payload;
        const payloadHash = MD5(dto);
        if (currentHash !== payloadHash) throw new UnauthorizedException();

        return payload;
    }
}

export const JwtAccessGuard = AuthGuard("jwt-access");
