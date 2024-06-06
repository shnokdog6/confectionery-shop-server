import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthRequestDto } from "@/auth/dto/AuthRequestDto";
import { AuthService } from "@/auth/auth.service";
import { Request, Response } from "express";
import { daysToMs } from "@/lib";
import { JwtRefreshGuard } from "@/auth/strategy/refresh.strategy";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    public async login(
        @Body() dto: AuthRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.login(dto);
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    @Post("register")
    async register(
        @Body() dto: AuthRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.register(dto);
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    @UseGuards(JwtRefreshGuard)
    @Get("update")
    public async updateTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.updateTokens(
            req.user["phoneNumber"],
            req.user["refreshToken"],
        );
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    private setRefreshToken(res: Response, refreshToken: string) {
        res.cookie("refreshToken", refreshToken, {
            maxAge: daysToMs(15),
            httpOnly: true,
            sameSite: "none",
        });
    }
}
