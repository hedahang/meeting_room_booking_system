import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import {
  NoRequireLogin,
  RequirePermission,
  UserInfo,
} from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('aaa')
  @NoRequireLogin()
  aaaa() {
    return 'aaa';
  }

  @Get('bbb')
  @RequirePermission(['ccc'])
  bbb(@UserInfo('username') username: string, @UserInfo() user: any) {
    console.log(username);
    console.log(user);
    return 'bbb';
  }
}
