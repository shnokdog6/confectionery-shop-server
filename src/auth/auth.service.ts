import { BadRequestException, Injectable } from "@nestjs/common";
import { authRequestDto } from "./dto/authRequestDto";
import { UserService } from "@/user/user.service";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "@/user/user.model";
import jwt from "jsonwebtoken";
import { authResponseDto } from "@/auth/dto/authResponseDto";
import { JwtPayloadDto } from "@/jwt/dto/JwtPayloadDto";
import { RoleService } from "@/role/role.service";
import { RoleType } from "@/role/role.enum";
import { Role, UserRoles } from "@/role/role.model";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
    ) {}

    public async login(dto: authRequestDto): Promise<authResponseDto> {
        const user = await this.userService.getByPhoneNumber(dto.phoneNumber);
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

    public async register(dto: authRequestDto): Promise<authResponseDto> {
        let candidate = await this.userService.getByPhoneNumber(
            dto.phoneNumber,
        );
        if (candidate) {
            throw new BadRequestException("Номер телефона занят");
        }
        candidate = await this.userService.create(dto);
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
    ): Promise<authResponseDto> {
        const user = await this.userService.getById(userID);

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
        user: User,
        refreshToken: string,
    ): Promise<void> {
        user.refreshToken = await bcrypt.hash(refreshToken, 3);
        await user.save();
    }

    private async getTokens(dto: JwtPayloadDto): Promise<authResponseDto> {
        return {
            accessToken: await this.jwtService.signAsync(dto),
            refreshToken: jwt.sign(dto, "refresh", { expiresIn: "15d" }),
        } as authResponseDto;
    }
}
