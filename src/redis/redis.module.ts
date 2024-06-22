import { Module } from "@nestjs/common";
import { RedisService } from "@/redis/redis.service";
import { redisClientFactory } from "@/redis/redis.factory";
import { RedisRepository } from "@/redis/redis.repository";
import { ConfigModule } from "@/config/config.module";

@Module({
    imports: [ConfigModule],
    exports: [RedisService],
    providers: [RedisService, RedisRepository, redisClientFactory],
})
export class RedisModule {}
