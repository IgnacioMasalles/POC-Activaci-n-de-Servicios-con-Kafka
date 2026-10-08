import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller()
export class BillingController {

  @EventPattern('activation.requested')
  async handleActivationRequested(@Payload() message: any, @Ctx() context: KafkaContext) {
    const event = typeof message === 'string' ? JSON.parse(message) : message;
    console.log(`💳 [Billing Service] Procesando activación para cliente: ${event.customerId}, Correlación: ${event.correlationId}`);

    const simulateFailure = event.payload?.simulateFailure;

    // Simulamos la lógica de negocio de facturación
    if (simulateFailure === 'billing') {
      console.log(`❌ [Billing Service] Fallo simulado en facturación para ${event.correlationId}`);
      // Aquí publicaríamos el evento BillingFailed hacia el tópico correspondiente
    } else {
      console.log(`✅ [Billing Service] Cuenta de facturación creada exitosamente para ${event.correlationId}`);
      // Aquí publicaríamos el evento BillingAccountCreated hacia el tópico 'billing.events'
    }
  }

  @EventPattern('activation.failed')
  async handleActivationFailed(@Payload() message: any) {
    const event = typeof message === 'string' ? JSON.parse(message) : message;
    console.log(`🔄 [Billing Service] Ejecutando compensación (anulando cuenta) para la activación: ${event.correlationId}`);
  }
}