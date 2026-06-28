# 📈 CB Swing Pro v13.3 — Estrategia de Trading en Pine Script

> Estrategia cuantitativa para **TradingView** (Pine Script v6) con entradas por *pullback-continuación*, filtro anti-rango, gestión de riesgo profesional y un módulo visual de **sesiones de mercado** y **niveles**. Diseñada para BTC, ETH, SOL y ORO mediante presets por activo.

![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-2962FF?logo=tradingview&logoColor=white)
![Plataforma](https://img.shields.io/badge/Plataforma-TradingView-131722?logo=tradingview&logoColor=white)
![Versión](https://img.shields.io/badge/Versi%C3%B3n-v13.3-blueviolet.svg)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)
![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen.svg)

Este repositorio contiene una estrategia automatizada de *trading* escrita en **Pine Script v6**, lista para ejecutarse y validarse en el **Strategy Tester** de TradingView. Su filosofía es priorizar **pocas señales de calidad** sobre muchas señales mediocres, con un control de riesgo estricto y un gráfico limpio y profesional.

> 📘 **¿Primera vez?** Lee la **[Guía para principiantes (explicada para todos)](GUIA.md)**.

---

## 📑 Contenido

- [Para inversores](#-para-inversores)
- [Para aficionados (cómo usarla)](#-para-aficionados-cómo-usarla)
- [Para expertos en tecnología](#-para-expertos-en-tecnología)
- [Presets por activo](#-presets-por-activo)
- [Parámetros](#-parámetros)
- [Validación y backtesting](#-validación-y-backtesting)
- [Aviso de riesgo](#-aviso-de-riesgo)
- [Licencia](#-licencia)

---

## 💼 Para inversores

**¿Qué es?** Un sistema de reglas que decide *cuándo* comprar o vender un activo y *cuánto* arriesgar en cada operación, de forma 100% objetiva y reproducible (sin emociones).

**¿Qué problema resuelve?** Las estrategias simples suelen entrar **tarde** (cuando el movimiento ya pasó) o **en mercado lateral** (donde se pierde por ruido). CB Swing Pro v13.3 ataca ambos problemas:

- **Entra en retrocesos, no en cruces tardíos:** espera a que el precio "respire" y vuelva hacia su media antes de continuar la tendencia → mejor relación riesgo/beneficio.
- **Evita el mercado lateral:** un filtro detecta cuándo no hay tendencia clara y **se queda fuera**.
- **Control de riesgo primero:** el tamaño de cada operación se calcula como un **porcentaje del capital**, con *stop loss* automático y tomas de ganancia escalonadas que **dejan correr a los ganadores**.

**Resultados de ejemplo (solo ilustrativos):** en pruebas históricas sobre activos como BTC y oro en temporalidad de 4 horas se han observado *Profit Factor* en torno a 1,3–1,5 y *drawdown* (caída máxima) bajo (≈ 2–5 %). 

> ⚠️ **Importante:** estos números **dependen del activo, la temporalidad y el periodo**, y el comportamiento pasado **no garantiza** resultados futuros. Esto **no es asesoramiento financiero**. Consulta la sección de [Aviso de riesgo](#-aviso-de-riesgo).

---

## 🎮 Para aficionados (cómo usarla)

### Instalación en 4 pasos
1. Abre **TradingView** → **Pine Editor** (parte inferior).
2. Copia el contenido de [`cb-swing-pro-v13.pine`](./cb-swing-pro-v13.pine) y pégalo.
3. Pulsa **Añadir al gráfico**. Arriba a la izquierda debe leerse **`CB v13.3 Quant`**.
4. Si actualizaste desde otra versión, pulsa **"Restablecer ajustes"** en el *Strategy Tester*.

### Qué verás en el gráfico
- **🔺/🔻 Triángulos:** marcan los giros del precio (suelos y techos).
- **Líneas de Soporte (verde) y Resistencia (rojo):** niveles recientes donde el precio puede reaccionar.
- **Cajas de sesión (Tokio 🗼 rosa, Londres 🇪🇺 azul, Nueva York 🗽 rojo):** muestran el rango de cada plaza con su promedio. Solo se ven las más recientes para no ensuciar el gráfico.
- **🕐 Reloj de sesiones** (abajo a la derecha): hora local de cada plaza y cuál está activa.
- **Panel** (arriba a la derecha): activo, modo, *score* y si hay tendencia o rango.
- **Líneas SL/TP:** solo aparecen cuando hay una operación abierta.

### Ajustes rápidos
- **Modo = Auto:** detecta solo si operar a corto (*Day*) o a medio plazo (*Swing*) según tu temporalidad.
- **Activo:** elige BTC / ETH / SOL / ORO (cada uno trae su calibración).
- **Perfil:** Conservador (más estricto), Balanceado o Agresivo.
- ¿Gráfico muy cargado? Baja **"Sesiones recientes a mostrar"** o desactiva **"Dibujar cajas de sesion"** y **"Mostrar niveles y swings"**.

---

## 🧪 Para expertos en tecnología

### Arquitectura (pipeline por barra, evaluado en barra confirmada)
1. **Régimen:** tendencia (`ADX ≥ umbral`) + **anti-rango** (separación mínima de EMA20/EMA50 medida en ATR) + volatilidad en banda (`ATR%`).
2. **Macro + HTF:** macro-tendencia por **pendiente de la EMA200** (reacciona antes que el cruce 50/200) y confirmación de temporalidad superior con `request.security(..., close[1], lookahead=barmerge.lookahead_off)` → **sin repintado**.
3. **Disparo (pullback-continuación):** retroceso reciente a la EMA20 + giro de momentum (RSI al alza/baja y giro del histograma MACD) + ruptura de continuación (`close > high[1]` / `close < low[1]`).
4. **Confirmación por estructura:** un *swing* (pivote) reciente valida la entrada (`ta.pivothigh/pivotlow`); configurable.
5. **Scoring 0–10:** pondera tendencia, macro, HTF, MACD, RSI, volumen y disparo; la entrada exige superar el `Min_Score` efectivo y un *edge* direccional.
6. **Gestión de riesgo:** *stop* híbrido (estructura vs. ATR con *clamp* a una banda mín./máx.), dimensionamiento por **% de equity** y *cap* de exposición.
7. **Gestión de salidas:** TP1 (1.0R, cierra 40 %), TP2 (30 %), *runner* (30 %) a TP3 con *trailing* Chandelier y *break-even* +0.2R tras TP1; salida defensiva por pérdida de momentum antes de TP1.

### Decisiones de ingeniería
- **No repintado:** lectura de HTF con `[1]` + `lookahead_off`; entradas solo en `barstate.isconfirmed`.
- **Precedencia de parámetros:** `CUSTOM del usuario → preset por activo → default del modo`.
- **Capa visual desacoplada:** sesiones, niveles y zonas se gestionan con `box`/`line`/`label` y **borrado *rolling*** (arrays + `array.shift`) para mantener el gráfico limpio y respetar los límites de objetos de Pine.
- **Robustez Pine v6:** argumentos `const` en `strategy()`, divisiones protegidas (`f_safe_div`), *casts* `int()` donde el API lo exige y detección de inicio de sesión sin `na()` sobre booleanos.

### Reloj de sesiones
Horas locales en vivo con `str.format_time(timenow, 'HH:mm', tz)` para `Asia/Tokyo`, `Europe/London` y `America/New_York`; filtro multi-sesión opcional por ventanas UTC configurables.

---

## 🎛️ Presets por activo

| Activo | ADX mín. (Day/Swing) | Min Score | Riesgo % | Volumen | Dirección | Notas |
|--------|----------------------|-----------|----------|---------|-----------|-------|
| **BTC** | 15 / 18 | 5–6 | 1.0 % | Sí | AMBOS | Tendencia macro + pullback |
| **ETH** | 16 / 19 | 5–6 | 0.8 % | Sí | AMBOS | Algo más estricto que BTC |
| **SOL** | 20 / 24 | 6–7 | 0.5 % | Sí | AMBOS | Más estricto, menor tamaño, *cooldown* mayor |
| **ORO** | 14 / 17 | 5–6 (short +2) | 0.8 % | Ignorado | LONG | Shorts muy restringidos |

> El **perfil** modula: *Conservador* sube `Min_Score` +1 y baja el riesgo ×0.75; *Agresivo* lo contrario. En **1h** se activa *Day* (HTF 4H); en **Diario**, *Swing* (HTF Diario).

---

## ⚙️ Parámetros

| Grupo | Descripción |
|-------|-------------|
| **1. Modo** | Auto / Swing / Day. |
| **2. Preset** | Activo, perfil de agresividad y dirección permitida. |
| **3. CUSTOM** | Parámetros del activo CUSTOM. |
| **4. Régimen** | Filtro anti-rango (separación mínima de EMAs en ATR). |
| **5. Entrada** | Ventana de *pullback*. |
| **6. Sesiones** | Filtro multi-sesión y ventanas horarias UTC. |
| **7. Riesgo** | Riesgo por operación (% equity), *stop* híbrido, apalancamiento y exposición. |
| **8. Visual** | Líneas SL/TP en posición. |
| **9. Visual sesiones** | Cajas de sesión, nº de sesiones recientes, reloj y fondo de régimen. |
| **10. Niveles** | Swings, líneas S/R, zonas y *swing* como confirmación. |

---

## 📊 Validación y backtesting

Valida sobre una **matriz** activo × modo × perfil (BTC · ETH · SOL · ORO / Swing · Day / Conservador · Balanceado · Agresivo), preferentemente en temporalidades intradía (5m–1h) para apreciar las cajas y niveles.

> ⚠️ **Pine Script no lee archivos CSV.** Los históricos usados en el desarrollo sirvieron para **calibración *offline***; la validación real se hace en el *Strategy Tester* de TradingView con sus datos. **El *Profit Factor* objetivo (> 2.0) es una meta de calibración, NO una garantía.** *Win rate* realista 55–70 %. Prueba siempre con comisiones, *slippage* y capital representativo.

---

## ⚠️ Aviso de riesgo

Este proyecto se publica con fines **educativos e informativos**. **No constituye asesoramiento financiero, de inversión ni de trading.** Operar en los mercados conlleva un riesgo elevado de pérdida y puede no ser adecuado para todos los perfiles. Eres el único responsable de tus decisiones. Opera solo con capital que puedas permitirte perder y consulta a un profesional acreditado si lo necesitas.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta [`LICENSE`](./LICENSE).

---

<p align="center"><sub>Hecho con 📈 y Pine Script · CB Swing Pro v13.3 (Quant Pullback + Sesiones + Niveles)</sub></p>
