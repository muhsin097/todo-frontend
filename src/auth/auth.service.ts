import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/utils/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (
      user &&
      (await this.usersService.comparePasswords(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    try {
      const payload = { username: user.username, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        username: user.username,
        _id: user._id,
      };
    } catch (error) {
      console.error('Error signing JWT:', error);
      throw new InternalServerErrorException('Error signing JWT');
    }
  }
}
