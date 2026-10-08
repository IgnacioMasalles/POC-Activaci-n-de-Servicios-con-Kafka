export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  correlationId: string;
  customerId: string;
  source: string;
  payload: T;
}

export interface ActivationRequestedPayload {
  planId: string;
  channel: string;
  simulateFailure: 'none' | 'billing' | 'provisioning';
}