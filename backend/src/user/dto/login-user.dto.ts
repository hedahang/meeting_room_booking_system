import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @ApiProperty({ description: '密码', minLength: 6, example: '123456' })
  password: string;
}
