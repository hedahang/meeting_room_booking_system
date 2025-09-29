// custom.decorator.ts
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

export const NoRequireLogin = () => SetMetadata('no-require-login', true);
export const RequirePermission = (permissions: string[]) =>
  SetMetadata('require-permission', permissions);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
