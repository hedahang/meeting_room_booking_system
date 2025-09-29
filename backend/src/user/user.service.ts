import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { md5 } from 'src/utils/';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();
  private readonly authRelations = ['roles', 'roles.permissions'];

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  private hashPassword(password: string) {
    return md5(password);
  }

  private isPasswordValid(plainPassword: string, hashedPassword: string) {
    return md5(plainPassword) === hashedPassword;
  }

  private async findUserByUsernameWithAuth(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: this.authRelations,
    });
  }

  private async findUserByIdWithAuth(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: this.authRelations,
    });
  }

  private buildUserInfo(user: User): UserInfoVo {
    return {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      headPic: user.headPic,
      phoneNumber: user.phoneNumber,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      createTime: user.createTime.toISOString(),
      roles: (user.roles || []).map((role) => role.name),
      permissions: (user.roles || []).flatMap((role) =>
        (role.permissions || []).map((permission) => permission.code),
      ),
    };
  }

  private signAccessToken(userInfo: {
    id: number;
    username: string;
    roles: string[];
    permissions: string[];
  }) {
    return this.jwtService.sign(
      {
        userId: userInfo.id,
        username: userInfo.username,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }

  private signRefreshToken(userId: number) {
    return this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
  }

  async register(registerUserDto: RegisterUserDto) {
    const { username, password, nickName, email, captcha } = registerUserDto;
    const res_captcha = await this.redisService.get(`captcha_${email}`);
    if (!res_captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (res_captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = this.hashPassword(password);
    newUser.nickName = nickName;
    newUser.email = email;
    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }
  // 注册验证码
  async registerCaptcha(email: string) {
    const captcha = Math.random().toString(36).substring(2, 8);
    await this.redisService.set(`captcha_${email}`, captcha, 60 * 5);
    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.findUserByUsernameWithAuth(username);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (!this.isPasswordValid(password, user.password)) {
      throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    }

    const loginUserVo = new LoginUserVo();
    let { userInfo, accessToken, refreshToken } =
      await this.generateTokenAndRefreshToken(user);
    loginUserVo.userInfo = userInfo;
    loginUserVo.accessToken = accessToken;
    loginUserVo.refreshToken = refreshToken;

    return loginUserVo;
  }
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.findUserByIdWithAuth(decoded.userId);
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      const { accessToken: access_token, refreshToken: refresh_token } =
        await this.generateTokenAndRefreshToken(user);
      return { access_token, refresh_token };
    } catch (error) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  async findUserById(userId: number) {
    const user = await this.findUserByIdWithAuth(userId);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return this.buildUserInfo(user);
  }

  // 生成 token和refreshToken
  async generateTokenAndRefreshToken(user: User) {
    const userInfo = this.buildUserInfo(user);
    const accessToken = this.signAccessToken({
      id: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
      permissions: userInfo.permissions,
    });
    const refreshToken = this.signRefreshToken(userInfo.id);
    return { userInfo, accessToken, refreshToken };
  }

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.name = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.name = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  // 更新用户密码
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword, email, captcha } = updatePasswordDto;
    const res_captcha = await this.redisService.get(
      `update_password_captcha_${email}`,
    );
    if (!res_captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (res_captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findUserByIdWithAuth(userId);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (!this.isPasswordValid(oldPassword, user.password)) {
      throw new HttpException('旧密码不正确', HttpStatus.BAD_REQUEST);
    }

    user.password = this.hashPassword(newPassword);
    await this.userRepository.save(user);
    return '密码修改成功';
  }
  // 修改密码验证码
  async updatePasswordCaptcha(email: string) {
    const captcha = Math.random().toString(36).substring(2, 8);
    await this.redisService.set(
      `update_password_captcha_${email}`,
      captcha,
      60 * 5,
    );
    await this.emailService.sendMail({
      to: email,
      subject: '修改密码验证码',
      html: `<p>你的修改密码验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }
  // 修改用户信息
  async updateInfo(userId: number, updateUserDto: UpdateUserDto) {
    const { nickName, email, captcha, headPic } = updateUserDto;
    const res_captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );

    if (!res_captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== res_captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const user = await this.findUserByIdWithAuth(userId);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (nickName) user.nickName = nickName;
    if (headPic) user.headPic = headPic;

    await this.userRepository.save(user);
    return '修改成功';
  }

  // 修改用户信息验证码
  async updateUserCaptcha(email: string) {
    const captcha = Math.random().toString(36).substring(2, 8);
    await this.redisService.set(
      `update_user_captcha_${email}`,
      captcha,
      60 * 5,
    );
    await this.emailService.sendMail({
      to: email,
      subject: '更改用户信息验证码',
      html: `<p>你的修改用户信息验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }
}
