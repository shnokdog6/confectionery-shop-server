import { RoleType } from "@/role/role.enum";

export class JwtPayloadDto {
    public readonly id: number;
    public readonly roles: RoleType[];
}
