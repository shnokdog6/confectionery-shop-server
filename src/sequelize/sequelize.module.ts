import { SequelizeModule as SM } from "@nestjs/sequelize";
import { ConfigModule } from "@/config/config.module";
import { ConfigService } from "@nestjs/config";

export const SequelizeModule = SM.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        dialect: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USERNAME"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DATABASE_NAME"),
        autoLoadModels: true,
    }),
});
