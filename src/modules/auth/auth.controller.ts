import { Response } from 'express';
import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { UserService } from '@microservice-user/module-user/user.service';
import { CONFIG } from '@microservice-user/module-config/config.provider';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';
import LoginDto from './dto/login.dto';

// Guard
import { JwtAuthGuard } from './guard/jwtAuth.guard';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';

// Entity
import { User } from '@microservice-user/entities';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Register successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Register unsuccessfully',
  })
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authService.register(registrationData);

    return user;
  }

  @HttpCode(200)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Login unsuccessfully',
  })
  async logIn(@Req() request, @Body() loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.authService.getAuthenticatedUser(email, password);
    const accessTokenData = this.authService.getCookieWithJwtAccessToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshTokenData = this.authService.getCookieWithJwtRefreshToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    request.res.setHeader('Set-Cookie', [
      accessTokenData.cookie,
      refreshTokenData.cookie,
    ]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  async verifyToken(@Req() request, @Res() response) {
    response.sendStatus(200);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Logout unsuccessfully',
  })
  async logOut(@Req() request, @Res() response: Response) {
    const { user } = request;

    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiResponse({
    status: 200,
    description: 'Refresh token successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Refresh token unsuccessfully',
  })
  refresh(@Req() request) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return user;
  }
}
