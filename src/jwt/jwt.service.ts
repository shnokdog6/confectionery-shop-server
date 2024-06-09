import { Injectable } from "@nestjs/common";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import jwt from "jsonwebtoken";
import { AuthResponseDto } from "@/auth/dto/AuthResponseDto";
import { RedisService } from "@/redis/redis.service";

@Injectable()
export class JwtService {
    constructor(private readonly redisService: RedisService) {}

    public async makeTokenExpired(userID: string) {
        const tokens =
            (await this.redisService
                .getTokenBlackList(userID)
                .then((res) => JSON.parse(res))) || [];
        tokens.push({});
        await this.redisService.saveTokenBlacklist(
            userID,
            JSON.stringify(tokens),
        );
    }

    public generateTokens(dto: JwtPayloadDto): AuthResponseDto {
        return {
            accessToken: jwt.sign(dto, "access", { expiresIn: "15m" }),
            refreshToken: jwt.sign(dto, "refresh", { expiresIn: "15d" }),
        } as AuthResponseDto;
    }
}
