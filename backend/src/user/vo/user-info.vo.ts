import { ApiProperty } from '@nestjs/swagger';

export class UserInfoVo {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  username: string;

  @ApiProperty({ description: '昵称', example: '张三' })
  nickName: string;

  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  email: string;

  @ApiProperty({
    description: '头像地址',
    example: 'https://example.com/avatar.png',
  })
  headPic: string;

  @ApiProperty({ description: '手机号', example: '13800000000' })
  phoneNumber: string;

  @ApiProperty({ description: '是否冻结', example: false })
  isFrozen: boolean;

  @ApiProperty({ description: '是否管理员', example: false })
  isAdmin: boolean;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T12:00:00.000Z' })
  createTime: string;

  @ApiProperty({ description: '角色列表', example: ['管理员'] })
  roles: string[];

  @ApiProperty({
    description: '权限代码列表',
    example: ['user:list', 'user:update'],
  })
  permissions: string[];
}
