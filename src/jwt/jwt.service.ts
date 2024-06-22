import { Injectable } from "@nestjs/common";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import jwt from "jsonwebtoken";
import { AuthResponseDto } from "@/auth/dto/AuthResponseDto";
import { RedisService } from "@/redis/redis.service";
import { MD5 } from "object-hash";
import { ConfigService } from "@nestjs/config";
import { JwtTokensDto } from "@/jwt/dto/JwtTokensDto";

@Injectable()
export class JwtService {
    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {}

    public async setCurrentPayload(payload: JwtPayloadDto) {
        await this.redisService.setCurrentPayloadHash(payload.id, MD5(payload));
    }

    public generateTokens(dto: JwtPayloadDto): JwtTokensDto {
        return {
            accessToken: jwt.sign(
                dto,
                this.configService.get("JWT_ACCESS_KEY"),
                { expiresIn: "15m" },
            ),
            refreshToken: jwt.sign(
                dto,
                this.configService.get("JWT_REFRESH_KEY"),
                { expiresIn: "15d" },
            ),
        } as JwtTokensDto;
    }
}
