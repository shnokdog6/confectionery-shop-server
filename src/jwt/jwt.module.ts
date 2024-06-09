import { JwtService } from "./jwt.service";
import { Module } from "@nestjs/common";
import { RedisModule } from "@/redis/redis.module";

@Module({
    imports: [RedisModule],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}
