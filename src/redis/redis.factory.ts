import { FactoryProvider } from "@nestjs/common";
import { Redis } from "ioredis";
import { ConfigService } from "@nestjs/config";

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: "RedisClient",
    useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const redisInstance = new Redis({
            host: configService.get("REDIS_HOST"),
            port: configService.get("REDIS_PORT"),
        });

        redisInstance.on("error", (e) => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [ConfigService],
};
