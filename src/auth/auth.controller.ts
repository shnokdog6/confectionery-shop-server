import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthRequestDto } from "@/auth/dto/AuthRequestDto";
import { AuthService } from "@/auth/auth.service";
import { Request, Response } from "express";
import { JwtRefreshGuard } from "@/auth/strategy/refresh.strategy";

const fifteenDaysInMilliseconds = 15 * 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post("login")
    public async login(
        @Body() dto: AuthRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.login(dto);
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    @HttpCode(HttpStatus.OK)
    @Post("register")
    async register(
        @Body() dto: AuthRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.register(dto);
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshGuard)
    @Get("update")
    public async refreshTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const data = await this.authService.refreshTokens(
            req.user["id"],
            req.user["refreshToken"],
        );
        this.setRefreshToken(res, data.refreshToken);
        return data;
    }

    private setRefreshToken(res: Response, refreshToken: string) {
        res.cookie("refreshToken", refreshToken, {
            maxAge: fifteenDaysInMilliseconds,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
    }
}
