import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { Activation, ActivationDocument } from './activation.schema';
import { ActivationRequestedPayload } from '../../../libs/contracts';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActivationService {
  constructor(
    @InjectModel(Activation.name) private activationModel: Model<ActivationDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async create(dto: { customerId: string; planId: string; simulateFailure?: 'none' | 'billing' | 'provisioning' }) {
    const activationId = `act-${uuidv4().substring(0, 8)}`;
    const correlationId = uuidv4();

    // 1. Guardar en MongoDB con estado PENDING (según requerimiento de la cátedra)
    const newActivation = new this.activationModel({
      activationId,
      customerId: dto.customerId,
      planId: dto.planId,
      status: 'PENDING',
      simulateFailure: dto.simulateFailure || 'none',
      history: [
        { eventType: 'ActivationRequested', at: new Date().toISOString() }
      ]
    });
    await newActivation.save();

    // 2. Armar el sobre común (envelope) del evento
    const eventPayload: ActivationRequestedPayload = {
      planId: dto.planId,
      channel: 'WEB',
      simulateFailure: dto.simulateFailure || 'none',
    };

    const eventEnvelope = {
      eventId: uuidv4(),
      eventType: 'ActivationRequested',
      version: 1,
      occurredAt: new Date().toISOString(),
      correlationId,
      customerId: dto.customerId,
      source: 'activation-api',
      payload: eventPayload,
    };

    // 3. Publicar el evento en el tópico 'activation.requested' usando customerId como clave (partition key)
    this.kafkaClient.emit('activation.requested', {
      key: dto.customerId,
      value: JSON.stringify(eventEnvelope),
    });

    return {
      activationId,
      status: 'PENDING',
      message: 'Activación solicitada y publicada en Kafka exitosamente',
    };
  }

  async findOne(activationId: string) {
    return this.activationModel.findOne({ activationId });
  }
}