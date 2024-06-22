import { JwtService } from "./jwt.service";
import { Module } from "@nestjs/common";
import { RedisModule } from "@/redis/redis.module";
import { ConfigModule } from "@/config/config.module";

@Module({
    imports: [ConfigModule, RedisModule],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}
