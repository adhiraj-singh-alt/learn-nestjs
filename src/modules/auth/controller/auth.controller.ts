import { Controller, Get, Post, Body, HttpCode, Req, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { Public } from 'src/common/decorators/public-route.decorator';
import { Request, Response } from 'express';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { COOKIE_TTL } from 'src/common/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() body: CreateAccountDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(200)
  @Public()
  @Post('sign-in')
  async signIn(@Res({ passthrough: true }) res: Response, @Body() body: SignInDto) {
    const { access_token, refresh_token } = await this.authService.signIn(body);
    res.cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: COOKIE_TTL });
    return { access_token };
  }

  @Get('sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    // res.clearCookie('refresh_token');
    res.clearCookie('refresh_token');
    return 'Logged out successfully';
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Cookies() cookie) {
    const { refresh_token } = cookie;
    return this.authService.refreshToken(refresh_token);
  }

  @Get('check')
  async check(@Req() req: Request) {
    return req.user;
  }
}
