# Auditoría de Pine Script y dashboard

Informe realizado el 22 de septiembre de 2026 y publicado en el repositorio el 2 de octubre de 2026.

- [Informe completo: hallazgos P01–P12](audit.md).
- [Resultados de las pruebas locales](evidence/dashboard-results.json).

Base auditada: `ba945cca67b523598f6e5c0bfae35ca52bdb5809`.

## Alcance

Revisión de estrategias v12–v15 y documentación, concentrando los hallazgos Pine en v15. Pruebas del dashboard JavaScript con DOM y dependencias de red/render sustituidas, más modelos aritméticos de fórmulas. No se realizaron operaciones financieras ni se compiló o backtesteó Pine en TradingView.

Los resultados `OK` confirman el comportamiento descrito; algunos reproducen defectos. No significan que esos defectos estén corregidos. El archivo JSON es evidencia de ejecución, no una suite autónoma ni una certificación del producto.

## Uso por otras IA

Consultar también [AGENTS.md](../../../AGENTS.md). Los cambios posteriores deben contrastarse con el commit auditado. Registrar correcciones y sus pruebas en un documento nuevo, conservando este informe como historial.

Esta incorporación publica documentación y evidencias. No aplica las correcciones propuestas ni valida cambios posteriores en TradingView. No contiene una auditoría de Vanta Bot.
