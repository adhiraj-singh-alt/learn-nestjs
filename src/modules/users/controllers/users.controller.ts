import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserService } from '../services/users.service';
import { CreateUserDto } from '../dto';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  async findAll() {
    // return 'heyasdasdsadsad';
    return this.UserService.getUsers();
  }

  @Post()
  async create(@Body() userPayload: CreateUserDto) {
    return this.UserService.createUser(userPayload);
  }

  @Get(':id')
  async findById(@Param('id') id: UUID) {
    return this.UserService.getUserById(id);
  }
}
