import { Injectable } from "@nestjs/common";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import jwt from "jsonwebtoken";
import { AuthResponseDto } from "@/auth/dto/AuthResponseDto";
import { RedisService } from "@/redis/redis.service";
import { MD5 } from "object-hash";

@Injectable()
export class JwtService {
    constructor(private readonly redisService: RedisService) {}

    public async setCurrentPayload(payload: JwtPayloadDto) {
        await this.redisService.setCurrentPayloadHash(payload.id, MD5(payload));
    }

    public generateTokens(dto: JwtPayloadDto): AuthResponseDto {
        return {
            accessToken: jwt.sign(dto, "access", { expiresIn: "15m" }),
            refreshToken: jwt.sign(dto, "refresh", { expiresIn: "15d" }),
        } as AuthResponseDto;
    }
}
