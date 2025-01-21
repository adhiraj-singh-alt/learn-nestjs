import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UUID } from 'crypto';
import { GLOBAL_ERROR_MESSAGE, userAPIConstants } from 'src/common/lib/constants';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { hashPassword } from 'src/common/utils/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Omit<User, 'password'>[] | null> {
    const { skip, take, where, orderBy } = params;

    try {
      const users = await this.prisma.user.findMany({ skip, take, where, orderBy, omit: { password: true } });

      return users;
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(userId: UUID): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          uuid: userId,
        },
        omit: { password: true },
      });

      if (!user) throw new HttpException(userAPIConstants.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);

      return user;
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User | null> {
    const { password } = data;
    try {
      const hashedPassword = hashPassword(password);
      const user = await this.prisma.user.create({ data: { ...data, password: hashedPassword } });

      if (!user) throw new HttpException(userAPIConstants.INVALID_USER_CREDENTIALS, HttpStatus.BAD_REQUEST);

      return user;
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser({ userId, data }: { userId: UUID; data: Prisma.UserUpdateInput }) {
    try {
      const user = await this.prisma.user.update({
        where: {
          uuid: userId,
        },
        data: data,
      });

      if (!user) throw new HttpException(userAPIConstants.INVALID_USER_CREDENTIALS, HttpStatus.BAD_REQUEST);

      return user;
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(userId: UUID): Promise<User> {
    try {
      const user = await this.prisma.user.delete({ where: { uuid: userId } });

      if (!user) throw new HttpException(userAPIConstants.USER_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);

      return user;
    } catch (error) {
      throw new HttpException(error.message || GLOBAL_ERROR_MESSAGE, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
