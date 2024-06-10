import { Module } from "@nestjs/common";
import { RedisService } from "@/redis/redis.service";
import { redisClientFactory } from "@/redis/redis.factory";
import { RedisRepository } from "@/redis/redis.repository";

@Module({
    imports: [],
    exports: [RedisService],
    providers: [RedisService, RedisRepository, redisClientFactory],
})
export class RedisModule {}