import { SequelizeModule } from "@nestjs/sequelize";

export const SequelizeConfiguredModule = SequelizeModule.forRoot({
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "ConfectioneryShop",
    autoLoadModels: true,
    // sync: {force: true}
});