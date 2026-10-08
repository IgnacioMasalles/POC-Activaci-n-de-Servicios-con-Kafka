# Guión de la Demo (TP08)

Este documento detalla los escenarios para probar la POC de Activación de Servicios con Kafka.

## Escenario 1: Camino Feliz (Todo OK)
1. Abrir la Demo UI (React) en el navegador.
2. Ingresar un ID de Cliente y un ID de Plan. Dejar "Simular Fallo" en "Ninguno".
3. Hacer clic en "Solicitar Activación".
4. Verificar en la timeline en vivo que llega el evento `ActivationRequested`, seguido de las confirmaciones paralelas de Facturación y Aprovisionamiento, y finalmente `ActivationCompleted`.
5. Verificar en Mailhog (http://localhost:8025) que se generó el email de bienvenida.

## Escenario 2: Fallo en Facturación (Compensación)
1. En el formulario de la UI, seleccionar "Fallo en Facturación" en el menú desplegable.
2. Hacer clic en Solicitar.
3. La timeline registrará el error y finalizará con el evento `ActivationFailed`.
4. En los logs de consola del microservicio de facturación se debe evidenciar la ejecución de la compensación (la anulación de la cuenta previamente creada).
5. En Mailhog debe aparecer el envío de un email de error de activación.

## Escenario 3: Fallo en Aprovisionamiento
1. Seleccionar "Fallo en Aprovisionamiento".
2. El resultado final debe ser el mismo que en el escenario anterior (Saga fallida, `ActivationFailed` y email de error), demostrando que la falla de un único componente en el proceso paralelo cancela toda la operación central.