import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Label extends Document {
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: [String] })
  labels: string[];
}

export const LabelSchema = SchemaFactory.createForClass(Label);
