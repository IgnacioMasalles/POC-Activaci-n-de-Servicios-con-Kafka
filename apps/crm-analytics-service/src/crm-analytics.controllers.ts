import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class CrmAnalyticsController {

  // Escucha todos los tópicos definidos en la arquitectura
  
  @EventPattern('activation.requested')
  async handleActivationRequested(@Payload() message: any) {
    this.logEvent('activation.requested', message);
  }

  @EventPattern('billing.events')
  async handleBillingEvents(@Payload() message: any) {
    this.logEvent('billing.events', message);
  }

  @EventPattern('provisioning.events')
  async handleProvisioningEvents(@Payload() message: any) {
    this.logEvent('provisioning.events', message);
  }

  @EventPattern('activation.events')
  async handleActivationEvents(@Payload() message: any) {
    this.logEvent('activation.events', message);
  }

  // Función auxiliar para simular el guardado en la colección event_log de MongoDB
  private logEvent(topic: string, message: any) {
    const event = typeof message === 'string' ? JSON.parse(message) : message;
    console.log(`📊 [CRM Analytics] Evento registrado desde el topic '${topic}': ${event.eventType} | Cliente: ${event.customerId} | Correlación: ${event.correlationId}`);
  }
}