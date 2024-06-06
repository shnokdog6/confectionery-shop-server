import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "@/role/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    public canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return this.matchRoles(user.roles, roles);
    }

    private matchRoles(array: RoleType[], include: RoleType[]) {
        for (const role of include) {
            if (!array.includes(role)) {
                return false;
            }
        }
        return true;
    }
}

export const Roles = Reflector.createDecorator<RoleType[]>();
