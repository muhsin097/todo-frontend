import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
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
      //Temporaily--> adds user , if user not found
      if (!user) {
        user = await this.usersService.createUser(username, password);
      }
      return { user: await this.authService.login(user) };
    } catch (error) {
      throw new BadRequestException('Login failed');
    }
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
