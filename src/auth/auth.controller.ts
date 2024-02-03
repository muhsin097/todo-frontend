// auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { UsersService } from 'src/utils/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ user: any }> {
    try {
      const { username, password } = body;
      let user = await this.authService.validateUser(username, password);
      if (!user) {
        user = await this.usersService.createUser(username, password);
      }
      return { user: await this.authService.login(user) };
    } catch (error) {
      throw new BadRequestException('Login failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: any): any {
    return req.user;
  }

  @Post('register')
  async register(
    @Body() body: { username: string; password: string },
  ): Promise<{ user: any }> {
    try {
      const { username, password } = body;
      const user = await this.usersService.createUser(username, password);
      return { user: await this.authService.login(user) };
    } catch (error) {
      throw new BadRequestException('Registration failed');
    }
  }
}
