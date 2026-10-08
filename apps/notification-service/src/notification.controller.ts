import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {

  // Escucha el tópico final donde la API de activación publica el resultado de toda la saga
  @EventPattern('activation.events')
  async handleActivationEvents(@Payload() message: any) {
    const event = typeof message === 'string' ? JSON.parse(message) : message;
    
    if (event.eventType === 'ActivationCompleted') {
      console.log(`📧 [Notification Service] Enviando email de BIENVENIDA a Mailhog para el cliente: ${event.customerId}, Correlación: ${event.correlationId}`);
    } else if (event.eventType === 'ActivationFailed') {
      console.log(`📧 [Notification Service] Enviando email de ERROR a Mailhog para el cliente: ${event.customerId}, Correlación: ${event.correlationId}`);
    }
  }
}