import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ExtendedRequest } from 'src/types/extendedRequest';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (!roles) {
      return true;
    }
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const user = request.user;
    const hasAccess = this.matchRoles(roles, user.userRole);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${roles.join(', ')}`,
      );
    }

    return true;
  }
}
