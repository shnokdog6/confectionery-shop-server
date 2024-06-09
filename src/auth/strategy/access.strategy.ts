import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { RedisService } from "@/redis/redis.service";
import { Request } from "express";

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
        let data = JSON.parse(
            await this.redisService.getTokenBlackList(payload.id),
        ) as Array<{
            token?: string;
            added?: number;
        }>;

        if (!data) return payload;

        const token = req.headers.authorization.split(" ")[1];
        const currentTime = Date.now();

        data = this.deleteExpireTokens(data, currentTime);

        for (let i = 0; i < data.length; i++) {
            if (!Object.keys(data[i]).length) {
                data[i] = { token, added: currentTime };
                await this.redisService.saveTokenBlacklist(
                    payload.id,
                    JSON.stringify(data),
                );
            }

            if (data[i].token === token) {
                throw new UnauthorizedException();
            }
        }

        await this.redisService.saveTokenBlacklist(
            payload.id,
            JSON.stringify(data),
        );
        return payload;
    }

    private deleteExpireTokens(
        data: Array<{ token?: string; added?: number }>,
        currentTime: number,
    ) {
        return data.filter((value) => {
            const difference = Math.abs(
                currentTime - (value.added || currentTime),
            );
            const differenceInMinutes = Math.floor(difference / 60000);
            return differenceInMinutes < 15;
        });
    }
}

export const JwtAccessGuard = AuthGuard("jwt-access");
