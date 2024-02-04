import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from 'src/project/entity/project.entity';

@Schema()
export class Task extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: false })
  isDone: boolean;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  time: string;

  @Prop()
  priority: string;

  @Prop()
  labels: string[];

  @Prop({ type: Types.ObjectId })
  project: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  subTasks: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
