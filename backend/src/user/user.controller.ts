import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { NoRequireLogin, UserInfo } from 'src/custom.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { UserInfoVo } from './vo/user-info.vo';
import { UserListVo } from './vo/user-list.vo';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({
    type: RegisterUserDto,
    description: '注册用户',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册用户/失败',
    type: String,
  })
  @Post('register')
  @NoRequireLogin()
  register(@Body() registerDto: RegisterUserDto) {
    return this.userService.register(registerDto);
  }

  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取注册验证码',
    type: String,
  })
  @Get('register-captcha')
  @NoRequireLogin()
  async registerCaptcha(@Query('email') email: string) {
    return this.userService.registerCaptcha(email);
  }

  @Get('init-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '初始化测试数据',
    type: String,
  })
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  @NoRequireLogin()
  @ApiBody({
    type: LoginUserDto,
    description: '用户登录',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码不正确',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
    type: LoginUserVo,
  })
  async login(@Body() loginDto: LoginUserDto) {
    return this.userService.login(loginDto);
  }

  @Post('refresh-token')
  @NoRequireLogin()
  @ApiBody({
    type: RefreshTokenDto,
    description: '刷新 token',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新 token 成功',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto.refreshToken);
  }

  // 获取
  @ApiBearerAuth()
  @Get('info')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户信息',
    type: UserInfoVo,
  })
  async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  // 更新
  // @Patch('update')
  // async update(@Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.updateUser(updateUserDto);
  // }

  // 更新用户密码
  @ApiBearerAuth()
  @Patch('update-password')
  @ApiBody({
    type: UpdatePasswordDto,
    description: '更新用户密码',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户不存在/旧密码不正确',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '密码修改成功',
    type: String,
  })
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  // 修改密码验证码
  @Get('update-password-captcha')
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取修改密码验证码',
    type: String,
  })
  async updatePasswordCaptcha(@Query('email') email: string) {
    return this.userService.updatePasswordCaptcha(email);
  }

  // 修改用户信息
  @Patch('update')
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
    description: '修改用户信息',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户不存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改成功',
    type: String,
  })
  async updateInfo(
    @UserInfo('userId') userId: number,
    @Body() updateInfoDto: UpdateUserDto,
  ) {
    return this.userService.updateInfo(userId, updateInfoDto);
  }

  // 修改用户信息验证码
  @Get('update-user-captcha')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@qq.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取更改用户信息验证码',
    type: String,
  })
  async updateUserCaptcha(@Query('email') email: string) {
    return this.userService.updateUserCaptcha(email);
  }

  // 冻结用户权限
  @Get('freeze')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    type: Number,
    description: '用户 ID',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '冻结用户权限',
    type: String,
  })
  async freeze(@Query('userId') userId: number) {
    return this.userService.freezeUserById(userId);
  }

  // 用户列表
  @Get('list')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
    example: 1,
    description: '页码',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    example: 10,
    description: '每页条数',
  })
  @ApiQuery({
    name: 'username',
    type: String,
    required: false,
    description: '用户名',
  })
  @ApiQuery({
    name: 'nickName',
    type: String,
    required: false,
    description: '昵称',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: '邮箱',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户列表',
    type: UserListVo,
  })
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return this.userService.findUserList(
      pageNo,
      pageSize,
      username,
      nickName,
      email,
    );
  }
  // 图片上传
  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // return this.userService.uploadImage(uploadImageDto);
    return 'http://localhost:3000/' + file.path;
  }
}
