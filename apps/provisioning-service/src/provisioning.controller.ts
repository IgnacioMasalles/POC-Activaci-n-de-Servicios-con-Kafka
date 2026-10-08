import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProvisioningController {

  @EventPattern('activation.requested')
  async handleActivationRequested(@Payload() message: any) {
    const event = typeof message === 'string' ? JSON.parse(message) : message;
    console.log(`⚙️ [Provisioning Service] Iniciando aprovisionamiento para el cliente: ${event.customerId}, Correlación: ${event.correlationId}`);

    const simulateFailure = event.payload?.simulateFailure;

    // Simulamos un retardo de aprovisionamiento (de 1 a 3 segundos, tal como pide el TP)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (simulateFailure === 'provisioning') {
      console.log(`❌ [Provisioning Service] Fallo simulado en el aprovisionamiento para ${event.correlationId}`);
      // Aquí publicaríamos el evento ProvisioningFailed
    } else {
      console.log(`✅ [Provisioning Service] Aprovisionamiento completado con éxito para ${event.correlationId}`);
      // Aquí publicaríamos el evento ProvisioningCompleted hacia el tópico 'provisioning.events'
    }
  }
}