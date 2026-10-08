import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Activation extends Document {
  @Prop({ required: true, unique: true })
  activationId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true, default: 'PENDING' })
  status: string; // PENDING, IN_PROGRESS, COMPLETED, FAILED

  @Prop({ type: Array, default: [] })
  events: Array<{ eventType: string; at: string }>;
}

export const ActivationSchema = SchemaFactory.createForClass(Activation);