# Instrucciones para agentes de código

Antes de modificar estrategias, presets, alertas o el dashboard, leer:

- [Auditoría del 22 de septiembre de 2026](docs/audits/2026-09-22/audit.md).
- [Alcance y evidencias](docs/audits/2026-09-22/README.md).

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
