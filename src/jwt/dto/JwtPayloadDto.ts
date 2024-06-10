import { RoleType } from "@/role/role.enum";

export class JwtPayloadDto {
    public readonly id: string;
    public readonly roles: RoleType[];
    public readonly iat?: number;
    public readonly exp?: number;
}
