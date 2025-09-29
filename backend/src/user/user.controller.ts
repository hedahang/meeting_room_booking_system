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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  @Get('register-captcha')
  async registerCaptcha(@Query('email') email: string) {
    console.log(email);
    return this.userService.registerCaptcha(email);
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto.refreshToken);
  }
}
