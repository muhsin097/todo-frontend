// users.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword });
    return newUser.save();
  }

  async findUser(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}
