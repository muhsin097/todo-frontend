import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './entity/task.entity';
import { ProjectModule } from '../project/project.module';
import { LabelService } from './label/label.service';
import { Label, LabelSchema } from './label/entity/labels.entity';
import { LabelController } from './label/label.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Label.name, schema: LabelSchema }]),
    ProjectModule,
  ],
  controllers: [TaskController, LabelController],
  providers: [TaskService, LabelService],
  exports: [TaskService, LabelService],
})
export class TaskModule {}
