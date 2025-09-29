import { ApiProperty } from '@nestjs/swagger';
import { UserInfoVo } from './user-info.vo';

export class LoginUserVo {
  @ApiProperty({ description: '用户信息', type: UserInfoVo })
  userInfo: UserInfoVo;

  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
