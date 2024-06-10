import { Inject, Injectable } from "@nestjs/common";
import { RedisRepository } from "@/redis/redis.repository";

const fifteenMinutesInSeconds = 60 * 15;

@Injectable()
export class RedisService {
    constructor(
        @Inject(RedisRepository)
        private readonly redisRepository: RedisRepository,
    ) {}

    public async deleteCurrentPayloadHash(userID: string) {
        return await this.redisRepository.delete("jwt-payload", userID);
    }

    async setCurrentPayloadHash(userID: string, data: string): Promise<void> {
        await this.redisRepository.setWithExpiry(
            "jwt-payload",
            userID,
            data,
            fifteenMinutesInSeconds,
        );
    }

    async getCurrentPayloadHash(userID: string): Promise<string | null> {
        return await this.redisRepository.get("jwt-payload", userID);
    }
}
