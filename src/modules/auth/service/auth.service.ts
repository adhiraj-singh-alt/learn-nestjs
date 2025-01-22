import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

      return {
        access_token: await this.JwtService.signAsync({ id: user.uuid, username: user.username, role: user.role }),
        refresh_token: await this.JwtService.signAsync(
          { id: user.uuid },
          { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_TTL },
        ),
      };
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log(refreshToken);
      const { id } = this.JwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.UserService.getUserById(id);

      if (!user) throw new NotFoundException('User not found');

      const new_acces_token = await this.JwtService.signAsync({ id, username: user.username, role: user.role });

      return { access_token: new_acces_token };
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
