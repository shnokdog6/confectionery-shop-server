import { Inject, Injectable } from "@nestjs/common";
import { RedisRepository } from "@/redis/redis.repository";

const fifteenMinutesInSeconds = 60 * 15;

@Injectable()
export class RedisService {
    constructor(
        @Inject(RedisRepository)
        private readonly redisRepository: RedisRepository,
    ) {}

    public async deleteTokenBlacklist(userID: string) {
        return await this.redisRepository.delete("blackList", userID);
    }

    async saveTokenBlacklist(userID: string, data: string): Promise<void> {
        await this.redisRepository.setWithExpiry(
            "blackList",
            userID,
            data,
            fifteenMinutesInSeconds,
        );
    }

    async getTokenBlackList(userID: string): Promise<string | null> {
        return await this.redisRepository.get("blackList", userID);
    }
}
