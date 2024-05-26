import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { authRequestDto } from "@/auth/dto/authRequestDto";
import { AuthService } from "@/auth/auth.service";
import { Request, Response } from "express";
import { daysToMs } from "@/lib";
import { JwtRefreshGuard } from "@/auth/strategy/refresh.strategy";

@Controller("auth")
export class AuthController {

    constructor(
        private authService: AuthService,
    ) {
    }

    @Post("login")
    public async login(
        @Body() dto: authRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        try {
            const data = await this.authService.login(dto);
            this.setRefreshToken(res, data.refreshToken);
            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    @Post("register")
    async register(
        @Body() dto: authRequestDto,
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
        const data = await this.authService.updateTokens(req.user["phoneNumber"], req.user["refreshToken"]);
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
