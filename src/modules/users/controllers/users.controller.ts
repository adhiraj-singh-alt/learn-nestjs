import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { UserService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly UserService: UserService) {}

  @ApiOkResponse({
    type: UserDto,
    isArray: true,
  })
  @Get()
  async getUsers(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('name') name?: string,
  ) {
    this.logger.verbose(`getUsers filters - page-${page}, limit-${limit}, name-${name}`);

    console.log('Hiiasndklasndklnsakl ndlksa');

    return this.UserService.getUsers({
      skip: page * limit,
      take: limit,
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.UserService.getUserById(id);
  }

  @ApiResponse({
    type: UserDto,
  })
  @Post()
  async createUser(@Body() userPayload: CreateUserDto) {
    return this.UserService.createUser(userPayload);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseUUIDPipe) id: UUID, @Body() userPayload: UpdateUserDto) {
    return this.UserService.updateUser({ userId: id, data: userPayload });
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.UserService.deleteUser(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file: Express.Multer.File, @Body() body) {
    console.log(file);
    console.log(body.name);
  }
}
