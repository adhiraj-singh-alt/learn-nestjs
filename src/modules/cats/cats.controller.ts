import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { UUID } from 'crypto';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { User } from 'src/decorators/user.decorator';

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CatsController {
  constructor(private CatsService: CatsService) {}

  @Post()
  async create(@Body() CreateCatDto: CreateCatDto) {
    console.log(CreateCatDto);
    // return;

    return this.CatsService.create(CreateCatDto);
  }

  @Get()
  async findAll(@User() user) {
    console.log(user);
    // await new Promise((res, rej) => setTimeout(res, 3000));
    return this.CatsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: UUID) {
    console.log(id);
    return this.CatsService.findById(id);
  }

  @Put(':id')
  async updatedById(@Body() catPayload: UpdateCatDto, @Param('id', ParseUUIDPipe) id: UUID) {
    return this.CatsService.update(id, catPayload);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.CatsService.delete(id);
  }
}
