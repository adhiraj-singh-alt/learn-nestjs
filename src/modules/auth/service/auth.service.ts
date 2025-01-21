import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/service/user.service';
import { SignInDto } from '../dto/sign-in.dto';
import { GLOBAL_ERROR_MESSAGE } from 'src/common/lib/constants';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from 'src/common/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly UserService: UserService,
    private readonly JwtService: JwtService,
  ) {}

  async signUp(userPayload: Prisma.UserCreateInput) {
    return this.UserService.createUser(userPayload);
  }

  async signIn(userPayload: SignInDto) {
    try {
      const user = await this.prisma.user.findFirst({ where: { username: userPayload.username } });

      if (!user) throw new BadRequestException('User not found');

      const isPasswordValid = verifyPassword(userPayload.password, user.password);

      if (!isPasswordValid) throw new BadRequestException('Password is incorrect');

      return { accessToken: await this.JwtService.signAsync({ id: user.uuid, username: user.username }) };
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async signOut(id: number) {
    return `This action returns a #${id} auth`;
  }

  async refreshToken(token: string) {
    console.log(token);
    return `your are authenticated user`;
  }

  async check(id: number) {
    return `This action removes a #${id} auth`;
  }
}
