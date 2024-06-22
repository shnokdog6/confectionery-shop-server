import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import bcrypt from "bcrypt";
import { AuthResponseDto } from "@/auth/dto/AuthResponseDto";
import { RoleService } from "@/role/role.service";
import { RoleType } from "@/role/role.enum";
import { AuthRequestDto } from "@/auth/dto/AuthRequestDto";
import { JwtService } from "@/jwt/jwt.service";
import { UserModel } from "@/user/user.model";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
    ) {}

    public async login(dto: AuthRequestDto): Promise<AuthResponseDto> {
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

        return {
            ...(await this.generateTokens(user)),
            roles: user.roles.map((role) => role.id),
        } as AuthResponseDto;
    }

    public async register(dto: AuthRequestDto): Promise<AuthResponseDto> {
        let candidate = await this.userService.getByPhoneNumber(
            dto.phoneNumber,
        );

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

        return {
            ...(await this.generateTokens(candidate, [RoleType.USER])),
            roles: [RoleType.USER],
        } as AuthResponseDto;
    }

    public async refreshTokens(userID: string, refreshToken: string) {
        const user = await this.userService.getByID(userID);

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

        return this.generateTokens(user);
    }

    private async generateTokens(user: UserModel, roles?: RoleType[]) {
        const tokens = this.jwtService.generateTokens({
            id: user.id,
            roles: roles || user.roles.map((role) => role.id),
        });
        user.refreshToken = await bcrypt.hash(tokens.refreshToken, 3);
        await user.save();
        return tokens;
    }
}
