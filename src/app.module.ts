import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelController } from './task/label/label.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
    TaskModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [AppController, LabelController],
  providers: [AppService],
})
export class AppModule {}
