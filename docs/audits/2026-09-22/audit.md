# Auditoría — Estrategia-de-Trading-con-Pine-Script

Fecha: 22 de septiembre de 2026. Repositorio: [RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script). Commit: `ba945cca67b523598f6e5c0bfae35ca52bdb5809`.

Pine Script v6, versiones v12–v15, documentación y dashboard HTML/JavaScript con Binance REST/WebSocket y simulador. Rama predeterminada revisada: feat/cb-swing-pro-v13-strategy. v15 es el archivo más reciente; el dashboard es otra implementación y no ejecuta Pine.

Auditoría de código y pruebas locales. Las correcciones y simplificaciones son propuestas; no se modificó el código de producto ni se desplegaron cambios. No se usaron credenciales reales, pagos ni operaciones financieras. Un resultado de compilación no demuestra que el producto completo funcione en producción.

## Dictamen y límites

No usar el dashboard para validar equivalencia o rentabilidad de la estrategia: se reprodujeron errores en RSI, control de tiempo y cambio de instrumento. En Pine hay discrepancias entre riesgo nominal, alertas y ciclo de colocación de salidas que requieren corrección y replay.

Se revisaron las cuatro versiones y sus diferencias, concentrando los hallazgos Pine en v15. Se ejecutó el JavaScript local con DOM y dependencias de red/render sustituidas. No hay compilador TradingView local: **Pine no fue compilado ni backtesteado en TradingView**. Las pruebas P01–P03 modelan fórmulas, no rendimiento ni fills de la plataforma. No se hicieron operaciones, no se conectó una cuenta de trading y no se validaron resultados financieros anunciados en README.

## Hallazgos

### P01 — Órdenes de salida tardías y riesgo recalculado tras entrar

**Prioridad: Alta.** Evidencia: [cb-swing-pro-v15.pine:311](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L311).

La entrada se procesa al cierre, calc_on_order_fills=false y las salidas solo se crean cuando position_size ya es distinto de cero. Con ese ciclo, no se crea el bracket en la evaluación que emite la entrada; además risk_unit toma dist_long/short de la evaluación posterior.

**Reproducción / alcance:** Inspección apoyada en semántica oficial: la primera evaluación posterior puede ser el cierre de la siguiente vela. SL/TP del alert de entrada se basan en dist/close previos, mientras la gestión Pine usa valores posteriores. No se reprodujeron fills en TradingView.

**Corrección:** Congelar distancia y parámetros al emitir la señal y colocar salidas coherentes con la entrada. Diseñar conscientemente recalculo al fill/órdenes bracket; habilitar calc_on_order_fills sin revisar backtest puede introducir resultados optimistas.

**Aceptación:** Replay muestra protección desde el fill, distancia fija y mismos SL/TP en alerta y estrategia, incluyendo gap/slippage.

### P02 — Apalancamiento multiplica el riesgo configurado

**Prioridad: Alta.** Evidencia: [cb-swing-pro-v15.pine:273](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L273).

El tamaño por riesgo usa cash*i_lev/dist. Al aumentar leverage se multiplica la pérdida al stop, no solo la capacidad de margen. Tampoco se utiliza pointvalue/mincontract ni conversión de moneda para otros instrumentos.

**Reproducción / alcance:** P01: equity=10.000, riesgo=1%, leverage=5, stop=10, precio=100 y exposición=25% produce pérdida teórica=500, frente a 100 nominales. En el valor por defecto leverage=1 no aparece esa multiplicación.

**Corrección:** Calcular unidades por cash/(distancia*valor_por_punto), convertir moneda si corresponde y redondear a contratos válidos. Usar leverage solo al limitar margen/exposición, o renombrar explícitamente el riesgo si se desea multiplicarlo.

**Aceptación:** En cada instrumento soportado, pérdida nominal al stop respeta presupuesto, descontando tolerancia declarada por comisiones/gaps; probar leverage 1 y 5.

### P03 — La garantía no-repaint del filtro HTF no está asegurada

**Prioridad: Media.** Evidencia: [cb-swing-pro-v15.pine:128](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L128).

Se combina expresión desplazada [1] con lookahead_off. No es la técnica recomendada para alinear valores HTF confirmados en histórico y tiempo real. Falta rechazar un HTF igual/inferior al del gráfico.

**Reproducción / alcance:** Revisión frente a documentación oficial, no una captura de repaint real. Debe comprobarse alineación alrededor del cierre HTF mediante reload/replay.

**Corrección:** Para HTF confirmado, usar expresión[1] con lookahead_on y validar que timeframe.in_seconds(HTF)>timeframe.in_seconds(). No activar lookahead_on sin desplazamiento.

**Aceptación:** Señales históricas coinciden tras recarga de una sesión en tiempo real y no hay lecturas de futuro; entradas con HTF inválido se rechazan.

### P04 — Trailing stop puede alejarse del precio

**Prioridad: Media.** Evidencia: [cb-swing-pro-v15.pine:333](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L333).

El stop se recalcula desde chandelier actual y BE, pero no se compara contra el stop anterior. Mayor ATR puede aflojarlo hasta el suelo BE. El dashboard repite la fórmula.

**Reproducción / alcance:** P03 modela un long: stop 114 pasa a 106 con máximo 120, BE102 y ATR creciente. No es una trayectoria real de mercado.

**Corrección:** Guardar stop previo y aplicar max(previo,candidato) en long / min en short; reiniciar al cambiar/cerrar posición. Definir si se pretende un stop móvil que puede aflojarse y nombrarlo así.

**Aceptación:** Después de activar trailing, secuencia long nunca decrece y short nunca crece.

### P05 — Identificación de versión y preset ORO contradicen documentación

**Prioridad: Media.** Evidencia: [cb-swing-pro-v15.pine:72](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L72).

v15 conserva título/panel v14.0. La documentación anuncia ORO sin cambios, pero f_minscore para ORO Swing cambia de 6 en v14 a 9 en v15.

**Reproducción / alcance:** Comparación de ambos archivos: ORO Swing=6→9. Usuarios pueden estar comprobando un preset diferente al anunciado.

**Corrección:** Decidir valor correcto del preset, actualizar versionado en título/panel/README y añadir una tabla de cambios generada de la configuración.

**Aceptación:** Versiones y parámetros exportados coinciden; una prueba de todos los presets detecta cambios no declarados.

### P06 — Media de sesión cuenta dos veces la primera vela

**Prioridad: Baja.** Evidencia: [cb-swing-pro-v15.pine:432](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L432).

La rama started inicializa sm=close y ct=1; la rama active suma de nuevo esa misma vela.

**Reproducción / alcance:** P02 con cierres 100 y 110 devuelve 103,33 en lugar de 105. Afecta al dato/gráfico de sesión, no demuestra una entrada errónea.

**Corrección:** Inicializar acumuladores a cero y sumar una vez, o usar if/else if mutuamente excluyentes.

**Aceptación:** Primera vela devuelve su cierre; dos velas devuelven media aritmética correcta.

### P07 — Porcentajes de cierre y contrato de alertas incompletos

**Prioridad: Media.** Evidencia: [cb-swing-pro-v15.pine:231](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-v15.pine#L231).

TP1 y TP2 aceptan hasta 99 cada uno sin validar suma; pueden agotar la posición y dejar sin runner TP3. Las strategy.exit no llevan alert_message; la entrada sí presupone que el bot arma el bracket.

**Reproducción / alcance:** Revisión de parámetros y seis strategy.exit. No afirmar que todo bot falle: un bot que crea bracket desde la entrada no necesita mensajes individuales de salida, pero debe conocer porcentajes y política de reconciliación.

**Corrección:** Validar 0<TP1+TP2<100 cuando se ofrece runner. Definir un contrato versionado con instrumento inequívoco, timeframe, idempotency key, cantidades por tramo y propietario de los stops (bot o plataforma). Añadir mensajes de salida solo si ese es el protocolo elegido.

**Aceptación:** Configuración inválida se rechaza; replay+bot sandbox concuerdan en cantidades, cierres parciales y reintentos sin órdenes duplicadas.

### P08 — Cooldown se congela cuando el buffer llega a 620 velas

**Prioridad: Alta funcional.** Evidencia: [cb-swing-pro-dashboard.html:374](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-dashboard.html#L374).

i es candles.length-1. Al alcanzarse 620, pushClosedBar desplaza el array y conserva i=619. Si una entrada queda registrada en ese índice, el cooldown no vuelve a transcurrir.

**Reproducción / alcance:** D06: tras 8 nuevas velas, diferencia i-lastEntryBar sigue en 0. Puede impedir nuevas entradas indefinidamente durante una sesión larga.

**Corrección:** Usar contador monotónico de barras cerradas o timestamp estable; no usar índice del buffer como reloj.

**Aceptación:** Con más de 1.000 barras y varias entradas, el cooldown se libera exactamente tras el número configurado, antes y después del límite.

### P09 — RSI del dashboard usa semilla incorrecta

**Prioridad: Media.** Evidencia: [cb-swing-pro-dashboard.html:316](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-dashboard.html#L316).

Durante la semilla acumula ganancias/pérdidas sin dividir por len. Después mezcla esa suma con una recurrencia que supone promedios.

**Reproducción / alcance:** D02 obtiene 52,6042 donde el cálculo Wilder de la misma serie da 71,7391. Esto altera scores, triggers y resultados del simulador.

**Corrección:** Dividir sumas al terminar semilla y aplicar suavizado Wilder consistente, definiendo warm-up y casos plano/solo ganancias/solo pérdidas.

**Aceptación:** Vectores conocidos coinciden con una referencia independiente y ta.rsi cuando se usen mismas barras y warm-up.

### P10 — Respuestas de un activo anterior contaminan el nuevo

**Prioridad: Media.** Evidencia: [cb-swing-pro-dashboard.html:645](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-dashboard.html#L645).

boot usa P global y no cancela ni identifica fetch. Cambiar rápidamente de BTC a ETH permite que una respuesta BTC tardía se procese bajo el preset ETH.

**Reproducción / alcance:** D05 resuelve ETH primero y BTC después: último seed queda symbol=ETHUSDT, price=60000. Es una carrera reproducida con red simulada.

**Corrección:** AbortController y generación de sesión: capturar preset local y descartar cualquier respuesta/evento cuya generación ya no sea vigente. Cerrar WS y timers de la generación anterior.

**Aceptación:** Invertir orden de respuestas no mezcla instrumentos; solo una conexión/timer activo por sesión.

### P11 — Stream sin deduplicación ni recuperación de cierre

**Prioridad: Media.** Evidencia: [cb-swing-pro-dashboard.html:627](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-dashboard.html#L627).

Cada cierre añade una vela sin comprobar timestamp; la última vela REST puede volver a entrar desde WS. onerror cambia a simulador, pero onclose no reconecta ni marca desconexión. seedSim(true) mezcla histórico previo y sintético sin separar sus métricas.

**Reproducción / alcance:** D07 reproduce dos timestamps iguales; D04 confirma ausencia de onclose. No se enviaron mensajes a Binance.

**Corrección:** Unificar velas por timestamp y estado de cierre, descartar REST no cerrada, recuperar huecos, manejar onclose con backoff y aislar simulación de datos reales.

**Aceptación:** REST/WS solapados producen una sola barra; cierre limpio cambia estado/reconecta; jamás se presenta resultado mixto como live.

### P12 — Métricas del dashboard no equivalen al backtest Pine

**Prioridad: Media.** Evidencia: [cb-swing-pro-dashboard.html:438](https://github.com/RonaldoBTC-code/Estrategia-de-Trading-con-Pine-Script/blob/ba945cca67b523598f6e5c0bfae35ca52bdb5809/cb-swing-pro-dashboard.html#L438).

realize suma PnL bruto sin costes; Pine declara comisión/slippage. El HTF es un submuestreo 5× de cierres, no las barras HTF del Pine. El simulador usa Math.random sin seed reproducible.

**Reproducción / alcance:** D03: operación al mismo precio no resta ningún coste. Revisión del HTF proxy y modelo. README no incluye datos/exportaciones suficientes para reproducir las métricas anunciadas.

**Corrección:** Etiquetar claramente demo y bruto/neto, modelar costes y fills, agregar OHLCV al mismo HTF y usar seed fija en tests. Publicar instrumento, fechas, datos, parámetros y export de operaciones antes de presentar cifras como validadas.

**Aceptación:** Resultados repetibles con mismo input; cálculo neto incluye costes; no se afirma equivalencia Pine/dashboard hasta contrastar señales y operaciones.

## Simplificación y mantenimiento

| Área | Cambio | Beneficio y riesgo a controlar |
|---|---|---|
| Long/short en dashboard | Normalizar dirección ±1 y compartir avance de TP/realización | Reduce bloques simétricos; probar gaps, stop+TP en misma vela y parciales. |
| Presets Pine | Agrupar parámetros en una función/estructura por activo y modo | Evita múltiples ternarios que ya permitieron discrepancia ORO. Mantener Pine compatible y legible. |
| Payloads | Función de construcción de alertas por dirección y versión | Evita JSON duplicado; validar formato y precisión. |
| Versiones v12–v15 | Mantener una versión activa y versiones históricas por tags/releases, si no son necesarias como ejemplos | Reduce copias mantenidas; no borrar historia ni prometer ahorro de runtime. |
| Dashboard | Separar datos, motor puro y render; indicadores incrementales | Evita recalcular arrays completos cada cierre; medir con 1.000/10.000 barras y comprobar valores idénticos. |
| Sesiones/fuentes | Una máquina de estados live/reconnecting/simulated con cleanup | Menos ramas dispersas; impide timers y respuestas obsoletas. |

Unificar helpers puede reducir líneas, pero Pine y JavaScript son motores distintos. No trasladar literalmente el código de uno al otro ni compactar ternarios para aparentar una mejora. No se modificaron estrategias ni se afirmó mejora de rentabilidad.

## Evidencia ejecutada

| Comprobación | Resultado observado |
|---|---|
| D01 Sintaxis e indicadores producen resultado | OK — [1,1.5,2.25] |
| D02 RSI suaviza suma sin dividir al terminar semilla | OK — {"actual":52.60416666666667,"wilder":71.73913043478261} |
| D03 PnL omite comisión/slippage | OK — "Roundtrip mismo precio no resta costes" |
| D04 WebSocket sin gestión de cierre normal | OK — "onerror sí; onclose ausente" |
| D06 Cooldown deja de avanzar al llenarse buffer | OK — "Pasaron 8 velas, cooldown mide 0 permanentemente" |
| D07 Cierre duplicado agrega una segunda vela igual | OK — "Sin deduplicación REST/WS" |
| D05 Cambio rápido de preset mezcla respuesta vieja | OK — {"symbol":"ETHUSDT","price":60000} |
| P01 Modelo aritmético: leverage multiplica riesgo | OK — {"riskConfigured":100,"stopLoss":500,"leverage":5,"scope":"Modelo de fórmula Pine, no ejecución TradingView"} |
| P02 Modelo aritmético: media sesión duplica primera vela | OK — {"actual":103.33333333333333,"expected":105} |
| P03 Modelo aritmético: trailing puede retroceder | OK — {"prior":114,"next":106,"scope":"Fórmula stop, no backtest"} |

## Validación pendiente en TradingView

Compilar v12–v15; ejecutar la versión elegida en cada activo/modo, con límites HTF, gaps, comisión, slippage y contratos correctos. Comprobar el primer stop, el fill de TP1 antes de BE, stops monotónicos, parciales que suman 100%, cierre de varias operaciones en una barra y contadores de pérdidas. Verificar histórico frente a live/reload y el contrato del bot en sandbox. Ninguno de estos backtests se declara aprobado.

Fuentes primarias: [Ciclo y órdenes de estrategias](https://www.tradingview.com/pine-script-docs/concepts/strategies/), [Repainting y HTF confirmado](https://www.tradingview.com/pine-script-docs/concepts/repainting/).
