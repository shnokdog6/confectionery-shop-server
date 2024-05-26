import { Injectable } from "@nestjs/common";
import { authRequestDto } from "./dto/authRequestDto";
import { UserService } from "@/user/user.service";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "@/user/user.model";
import jwt from "jsonwebtoken";
import { authResponseDto } from "@/auth/dto/authResponseDto";

@Injectable()
export class AuthService {


    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {
    }

    public async login(dto: authRequestDto) {
        const user = await this.userService.getByPhoneNumber(dto.phoneNumber);
        if (!user) {
            throw new Error("Пользоветель не существует");
        }
        const isPasswordsEquals = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordsEquals) {
            throw new Error("Неверный пароль");
        }
        const tokens = await this.getTokens(user.phoneNumber, user.password);
        await this.updateRefreshToken(user, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        } as authResponseDto;
    }

    public async register(dto: authRequestDto) {
        let candidate = await this.userService.getByPhoneNumber(dto.phoneNumber);
        if (candidate) {
            throw new Error("Номер телефона занят");
        }
        candidate = await this.userService.create(dto);
        const tokens = await this.getTokens(candidate.phoneNumber, candidate.password);
        await this.updateRefreshToken(candidate, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        } as authResponseDto;
    }

    public async updateTokens(phoneNumber: string, refreshToken: string) {
        const user = await this.userService.getByPhoneNumber(phoneNumber);

        if (!user || !user.refreshToken) {
            throw new Error("Access Denied");
        }

        const refreshTokensMatches = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!refreshTokensMatches) {
            throw new Error("Access Denied");
        }

        const tokens = await this.getTokens(user.phoneNumber, user.password);
        await this.updateRefreshToken(user, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        } as authResponseDto;
    }

    private async updateRefreshToken(user: User, refreshToken: string) {
        user.refreshToken = await bcrypt.hash(refreshToken, 3);
        await user.save();
    }

    private async getTokens(phoneNumber: string, password: string) {
        return {
            accessToken: await this.jwtService.signAsync({
                phoneNumber,
                password,
            }),
            refreshToken: jwt.sign({
                phoneNumber,
                password,
            }, "refresh", { expiresIn: "15d" }),
        };
    }

}
