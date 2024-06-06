import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "@/user/user.model";
import jwt from "jsonwebtoken";
import { AuthResponseDto } from "@/auth/dto/AuthResponseDto";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { RoleService } from "@/role/role.service";
import { RoleType } from "@/role/role.enum";
import { Role } from "@/role/role.model";
import { AuthRequestDto } from "@/auth/dto/AuthRequestDto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
    ) {}

    public async login(dto: AuthRequestDto): Promise<AuthResponseDto> {
        const user = await this.userService
            .get({
                phoneNumber: dto.phoneNumber,
            })
            .then((result) => result[0]);

        if (!user) {
            throw new BadRequestException("Пользоветель не существует");
        }
        const isPasswordsEquals = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (!isPasswordsEquals) {
            throw new BadRequestException("Неверный пароль");
        }

        const userRoles = await this.roleService
            .get({ userID: user.id })
            .then((result) => result.map((item: Role) => item.id as RoleType));

        const tokens = await this.getTokens({
            id: user.id,
            roles: userRoles,
        });
        await this.updateRefreshToken(user, tokens.refreshToken);

        return tokens;
    }

    public async register(dto: AuthRequestDto): Promise<AuthResponseDto> {
        let candidate = await this.userService
            .get({
                phoneNumber: dto.phoneNumber,
            })
            .then((result) => result[0]);

        if (candidate) {
            throw new BadRequestException("Номер телефона занят");
        }
        candidate = await this.userService.create({
            phoneNumber: dto.phoneNumber,
            password: dto.password,
        });
        await this.roleService.addRolesToUser({
            userID: candidate.id,
            roles: [RoleType.USER],
        });

        const tokens = await this.getTokens({
            id: candidate.id,
            roles: [RoleType.USER],
        });
        await this.updateRefreshToken(candidate, tokens.refreshToken);

        return tokens;
    }

    public async updateTokens(
        userID: number,
        refreshToken: string,
    ): Promise<AuthResponseDto> {
        const user = await this.userService
            .get({
                id: userID,
            })
            .then((result) => result[0]);

        if (!user || !user.refreshToken) {
            throw new BadRequestException();
        }

        const refreshTokensMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (!refreshTokensMatches) {
            throw new BadRequestException();
        }

        const tokens = await this.getTokens({
            id: user.id,
            roles: user.roles.map((role) => role.id),
        });
        await this.updateRefreshToken(user, tokens.refreshToken);

        return tokens;
    }

    private async updateRefreshToken(
        user: UserModel,
        refreshToken: string,
    ): Promise<void> {
        user.refreshToken = await bcrypt.hash(refreshToken, 3);
        await user.save();
    }

    private async getTokens(dto: JwtPayloadDto): Promise<AuthResponseDto> {
        return {
            accessToken: await this.jwtService.signAsync(dto),
            refreshToken: jwt.sign(dto, "refresh", { expiresIn: "15d" }),
        } as AuthResponseDto;
    }
}
