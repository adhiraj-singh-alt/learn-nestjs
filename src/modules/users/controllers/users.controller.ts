import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
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

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly UserService: UserService) {}

  @Get()
  async getUsers(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name: string,
  ) {
    this.logger.verbose(`getUsers filters - page-${page}, limit-${limit}, name-${name}`);
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

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.UserService.getUserById(id);
  }

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
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // validators: [new FileTypeValidator({ fileType: 'image/png' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return 'uploading file..';
  }
}
