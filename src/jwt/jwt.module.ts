import { JwtModule } from "@nestjs/jwt";

export const JwtConfiguredModule = JwtModule.register({
    secret: "access",
    signOptions: { expiresIn: "15m" },
});
