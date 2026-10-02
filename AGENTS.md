# Instrucciones para agentes de código

Antes de modificar estrategias, presets, alertas o el dashboard, leer:

- [Auditoría del 22 de septiembre de 2026](docs/audits/2026-09-22/audit.md).
- [Alcance y evidencias](docs/audits/2026-09-22/README.md).
- [Correcciones del 2 de octubre y pendientes obligatorios](docs/audits/2026-10-02/corrections.md).

## Estado actual para agentes

v15.1 y el dashboard incorporan correcciones P01–P12. El dashboard sigue siendo una demostración con HTF aproximado. Pine no ha sido compilado ni validado en TradingView; integración con bots y equivalencia entre motores siguen pendientes. v12–v14 son históricos sin estas correcciones.

Ejecutar `node tests/audit-regressions.cjs` antes de cambiar el motor. Consultar el registro de pruebas y la lista de pendientes del documento del 2 de octubre. Prioridad siguiente: compilación/replay Pine, cantidades OCA y migración del contrato de alertas a v1 en sandbox. No crear un segundo bracket en el bot: las salidas pertenecen a la estrategia. No afirmar que Vanta Bot fue integrado o auditado.

## Interpretación de la auditoría

La auditoría corresponde al commit `ba945cca67b523598f6e5c0bfae35ca52bdb5809`. Contiene 12 hallazgos P01–P12. Es una referencia histórica: contrastar cada hallazgo con el código actual antes de cambiarlo o considerarlo vigente.

No confundir las pruebas del dashboard JavaScript y los modelos aritméticos con una compilación o backtest de Pine en TradingView. No afirmar que se verificaron fills, rentabilidad, equivalencia entre motores o comportamiento de un bot real sin evidencia de esas pruebas.

## Cambios y validación

- Priorizar el ciclo de colocación de stops, el riesgo con apalancamiento y la coherencia entre alertas y estrategia (P01–P02).
- En el dashboard, conservar cobertura del reloj de barras con más de 620 velas, RSI, cambio rápido de instrumento y eventos REST/WebSocket duplicados (P08–P11).
- Al cambiar presets, actualizar la documentación y comprobar todos los activos/modos, incluido ORO. Mantener identificadores de versión coherentes.
- Antes de simplificar código, preservar validaciones, límites de riesgo, idempotencia y comportamiento observable. Reducir duplicación; no medir mejora solo por líneas borradas.
- Documentar el ID del hallazgo atendido, el commit de corrección, las pruebas ejecutadas y las limitaciones pendientes. No marcar un hallazgo como resuelto únicamente por editar el código.
- Mantener el informe original como registro y añadir resultados posteriores por separado.
- No utilizar credenciales reales ni ejecutar órdenes financieras para validar cambios sin autorización específica del usuario.

Estas instrucciones no autorizan despliegues ni operaciones en cuentas reales.
