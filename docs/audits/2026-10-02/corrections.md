# Correcciones y trabajo pendiente para agentes

Fecha: 2 de octubre de 2026. Base: `5955e7f1c4e469ad339a24171b5cdef9af2db63f`. La auditoría original se conserva en `../2026-09-22/audit.md`.

## Cambios aplicados

| Hallazgo | Cambio | Estado de validación |
|---|---|---|
| P01 | Bracket enviado en la evaluación de entrada; distancia, precio de referencia y tamaño congelados. No se recalculan desde la vela siguiente. | Revisión estática; replay pendiente. |
| P02 | Riesgo sin multiplicar por leverage; conversión a moneda del instrumento, pointvalue y redondeo mincontract. Leverage limita exposición, no riesgo. | Modelo de fórmula extraída probado; Pine pendiente. |
| P03 | HTF confirmado con `[1]` y `lookahead_on`; rechazo de HTF igual/inferior. En diario, Auto usa semanal. | Revisión estática; live/reload pendiente. |
| P04 | Stops monotónicos en ambos motores. El simulador comprueba primero el stop previamente colocado, sin usar precios posteriores de la misma vela. | Long/short probados en JS; Pine pendiente. |
| P05 | Título/panel v15.1; ORO Swing vuelve a minScore 6. | Revisión estática. |
| P06 | Acumuladores de sesión comienzan en cero y suman cada cierre una vez. | Revisión estática; gráfico Pine pendiente. |
| P07 | Suma TP1+TP2 menor que 100; tramos absolutos redondeados. Se omiten entradas sin tamaño suficiente para ambos parciales. Contrato JSON v1, instrumento completo, timeframe, clave de evento y propietario strategy. Mensajes para entradas, parciales y defensa. | Revisión estática; bot sandbox pendiente. |
| P08 | Contador de barras independiente del buffer limitado a 620. | Probado con 1.050 cierres y duplicados. |
| P09 | Semilla RSI promediada y recurrencia Wilder; warmup NaN y extremos definidos. | Referencia independiente y extremos probados. |
| P10 | AbortController y generación de sesión para REST, sockets y reconexiones. | Carrera BTC/ETH reproducida sin contaminación. |
| P11 | Descarte de cierres duplicados/antiguos y REST no cerrada; onclose con backoff y recuperación REST de huecos. Error WS no mezcla datos sintéticos. | Red simulada; integración real pendiente. |
| P12 | PnL estimado descuenta comisión y deslizamiento; PRNG con seed fija; aviso visible de demo, fuente y HTF aproximado. | Costes y repetibilidad probados. Equivalencia con Pine sigue pendiente. |

Se comparte la gestión long/short de órdenes Pine para reducir duplicación. v12–v14 permanecen históricos y conservan sus defectos; las correcciones se aplican únicamente a v15 y al dashboard.

## Pruebas reproducibles

Ejecutar desde la raíz: `node tests/audit-regressions.cjs`. Solo requiere Node.js y módulos estándar; no conecta Binance, TradingView ni cuentas financieras. Para actualizar el registro: `node tests/audit-regressions.cjs --record`.

Resultados: [regression-results.json](regression-results.json). Las pruebas JavaScript usan DOM/render/red sustituidos. Las comprobaciones Pine son estáticas y un modelo de su fórmula de tamaño: **no son compilación ni backtest**.

## Pendientes obligatorios para los siguientes agentes

1. Compilar v15.1 en TradingView. Ejecutar replay sobre BTC, ETH, SOL, ORO y CUSTOM, ambos lados, Day/Swing y perfiles. Revisar gaps, slippage, conversión de moneda, mincontract y primer stop desde el fill.
2. Confirmar reserva de cantidades y OCA de TP1/TP2/TP3, cierres parciales y ausencia de reapertura de un tramo consumido. Breakeven se modifica en la siguiente evaluación después del fill registrado: no se promete actualización intrabar. `calc_on_order_fills` sigue desactivado deliberadamente.
3. Las salidas absolutas están ancladas al cierre de señal para coincidir con el bracket inicial. Slippage/gaps y costes pueden superar el riesgo nominal. Medirlo en replay; no afirmar garantía de pérdida máxima.
4. Verificar HTF tras recarga en tiempo real. El cambio diario→semanal en Auto modifica señales y requiere recalibración. El dashboard conserva un proxy 5x aproximado y diferencias en indicadores, defensiva y guardas de riesgo: no usarlo como backtest equivalente a Pine.
5. Validar contrato de alertas en sandbox. Migración incompatible con el JSON anterior: el bot no debe crear un segundo bracket. Consumir fills, no intenciones; usar cantidades/precios realmente ejecutados. En la alerta TradingView envolver `{{strategy.order.alert_message}}` junto a `{{strategy.order.contracts}}`, `{{strategy.order.price}}` y `{{strategy.order.id}}`. Deduplicar por clave y tramo; reconciliar con el exchange, identificando estrategia/instancia antes de permitir dos alertas del mismo instrumento/timeframe.
6. No existe integración Vanta Bot en este repositorio ni fue probado un bot real. No informar a un agente que esa integración está terminada.
7. Probar desconexiones reales, restricciones CORS, límites Binance y cortes de más de 1.000 minutos. La recuperación se bloquea y reintenta si faltan barras; no continúa con un histórico incompleto. Falta estrategia operativa para interrupciones largas y persistencia entre recargas.
8. El modelo de costes JS usa 0,08% por lado y 2 puntos básicos por lado; Pine usa 2 ticks. No son equivalentes. Se imputa comisión de entrada proporcionalmente al realizar cada tramo; equity de posición abierta no incluye todos los costes pendientes. No se validó funding, liquidación ni cartera real.
9. Revisar contadores de pérdidas por operación completa, cierres múltiples, límites diarios y prioridad de eventos intrabar. No validar rentabilidad con el contador de parciales ni con OHLC sin orden intrabar.

No marcar un pendiente como cerrado hasta publicar evidencia, configuración y commit correspondiente. No ejecutar órdenes reales como prueba.

Referencias: [órdenes y reservas Pine](https://www.tradingview.com/pine-script-docs/concepts/strategies/), [HTF confirmado](https://www.tradingview.com/pine-script-docs/concepts/repainting/).
