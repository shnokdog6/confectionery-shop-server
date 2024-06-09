import { RoleType } from "@/role/role.enum";

export class JwtPayloadDto {
    public readonly id: string;
    public readonly roles: RoleType[];
}
