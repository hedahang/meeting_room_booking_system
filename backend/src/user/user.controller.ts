import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NoRequireLogin, UserInfo } from 'src/custom.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @NoRequireLogin()
  register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  @Get('register-captcha')
  @NoRequireLogin()
  async registerCaptcha(@Query('email') email: string) {
    return this.userService.registerCaptcha(email);
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  @NoRequireLogin()
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh-token')
  @NoRequireLogin()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto.refreshToken);
  }

  // 获取
  @Get('info')
  async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  // 更新
  // @Patch('update')
  // async update(@Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.updateUser(updateUserDto);
  // }

  // 更新用户密码
  @Patch('update-password')
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  // 修改密码验证码
  @Get('update-password-captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    return this.userService.updatePasswordCaptcha(email);
  }

  // 修改用户信息
  @Patch('update')
  async updateInfo(
    @UserInfo('userId') userId: number,
    @Body() updateInfoDto: UpdateUserDto,
  ) {
    return this.userService.updateInfo(userId, updateInfoDto);
  }

  // 修改用户信息验证码
  @Get('update-user-captcha')
  async updateUserCaptcha(@Query('email') email: string) {
    return this.userService.updateUserCaptcha(email);
  }
}
