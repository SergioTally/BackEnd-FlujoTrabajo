import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    enum: ['Pendiente', 'En proceso', 'Terminada'],
    default: 'Pendiente',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
