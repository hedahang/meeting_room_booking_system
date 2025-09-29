import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import type { Request } from 'express';
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest(); // 获取请求对象
    const user = request.user;
    if (!user) {
      return true;
    }
    const requirePermission = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getHandler(), context.getClass()],
    );
    if (!requirePermission) {
      return true;
    }
    const permissions = user.permissions;
    const hasPermission = permissions.some((p) =>
      requirePermission.includes(p),
    );
    if (!hasPermission) {
      throw new UnauthorizedException('您没有访问该接口的权限');
    }
    return true;
  }
}
