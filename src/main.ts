import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { VersioningType } from "@nestjs/common";

(async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api")
        .enableVersioning({
            type: VersioningType.URI,
            defaultVersion: "1",
        })
        .enableCors({
            origin: true,
            credentials: true,
        });
    await app.listen(3000);
})();
