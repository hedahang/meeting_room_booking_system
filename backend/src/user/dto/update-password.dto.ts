import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class UpdatePasswordDto {
  @IsNotEmpty({
    message: '旧密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  oldPassword: string;

  @IsNotEmpty({
    message: '新密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
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
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
