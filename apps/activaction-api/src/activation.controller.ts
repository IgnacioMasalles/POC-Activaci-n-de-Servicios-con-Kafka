import { Controller, Post, Body, Get, Param } from '@nestjs/common';

@Controller('activations')
export class ActivationController {
  
  @Post()
  createActivation(@Body() body: { customerId: string; planId: string; simulateFailure?: string }) {
    // Aquí recibiremos la solicitud y publicaremos el evento en Kafka
    return {
      status: 'PENDING',
      message: 'Activación solicitada exitosamente',
      data: body,
    };
  }

  @Get(':id')
  getStatus(@Param('id') id: string) {
    return {
      activationId: id,
      status: 'PENDING',
      events: [],
    };
  }
}