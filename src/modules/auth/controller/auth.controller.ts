import { Controller, Get, Post, Body, UseGuards, HttpCode, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Public } from 'src/common/decorators/public-route.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/Enums';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: CreateAccountDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @Public()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  // @Get('sign-out')
  // async signOut(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.signOut();
  // }

  @Get('refresh-token')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin, Role.User)
  async refreshToken(@Req() req: Request) {
    const token = 'aslndlksa';
    console.log(req.user);
    return this.authService.refreshToken(token);
  }

  // @Get('check')
  // async check(@Param('id') id: string) {
  //   return this.authService.check(+id);
  // }
}
