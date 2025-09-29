import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';
// import { UnLoginException } from './unlogin.filter';
interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const noRequireLogin = this.reflector.getAllAndOverride(
      'no-require-login',
      [context.getHandler(), context.getClass()],
    );
    if (noRequireLogin) {
      return true;
    }
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('请先登录');
      // throw new UnLoginException('用户未登录');
    }
    try {
      const token = authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
