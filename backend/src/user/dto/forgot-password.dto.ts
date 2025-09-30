import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ForgotPasswordDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  username: string;

  @IsNotEmpty({
    message: '旧密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @ApiProperty({ description: '旧密码', minLength: 6, example: '123456' })
  oldPassword: string;

  @IsNotEmpty({
    message: '新密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @ApiProperty({ description: '新密码', minLength: 6, example: '654321' })
  newPassword: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty({ description: '邮箱验证码', example: 'abc123' })
  captcha: string;
}
