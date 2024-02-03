import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
