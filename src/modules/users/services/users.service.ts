import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUsers(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }
  async getUserById(userId: UUID): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        uuid: userId,
      },
    });
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User | null> {
    return this.prisma.user.create({ data });
  }
  async updateUser({ userId, data }: { userId: UUID; data: Prisma.UserUpdateInput }): Promise<User> {
    return this.prisma.user.update({
      where: {
        uuid: userId,
      },
      data: data,
    });
  }
  async deleteUser(userId: UUID): Promise<User> {
    return this.prisma.user.delete({ where: { uuid: userId } });
  }
}
