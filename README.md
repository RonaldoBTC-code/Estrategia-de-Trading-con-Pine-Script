# 📈 Estrategia de Trading con Pine Script

> **CB Swing Pro v12** — Una estrategia cuantitativa para TradingView con modos *Swing* y *Day* auto-detectados, presets por activo y gestión de riesgo profesional.

![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-2962FF?logo=tradingview&logoColor=white)
![Plataforma](https://img.shields.io/badge/Plataforma-TradingView-131722?logo=tradingview&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)
![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen.svg)

CB Swing Pro v12 es una estrategia escrita en **Pine Script v6** para el *Strategy Tester* de **TradingView**. Combina un filtro de tendencia de temporalidad superior (HTF), un análisis de régimen y sesión, un sistema de *scoring* de 0 a 10 y una gestión de salidas por etapas, todo ello calibrado mediante presets por activo y perfiles de agresividad. Su objetivo es ofrecer un marco de decisión transparente, reproducible y fácil de adaptar a distintos estilos operativos.

---

## 📑 Tabla de contenidos

- [✨ Características](#-características)
- [🧠 ¿Cómo funciona?](#-cómo-funciona)
- [🚀 Instalación y uso](#-instalación-y-uso)
- [⚙️ Parámetros principales](#️-parámetros-principales)
- [📊 Validación y backtesting](#-validación-y-backtesting)
- [⚠️ Aviso de riesgo](#️-aviso-de-riesgo)
- [📄 Licencia](#-licencia)

---

## ✨ Características

- **Modos Swing y Day auto-detectados.** El modo operativo se deduce de la temporalidad del gráfico (≤ 60 min → *Day*, > 60 min → *Swing*) o se fija manualmente.
- **Presets por activo.** Calibraciones listas para **BTC, ETH, SOL, ORO** y un perfil **CUSTOM** totalmente configurable.
- **Perfiles de agresividad.** Modos *Conservador*, *Balanceado* y *Agresivo* que modulan el `Min_Score` y el riesgo por operación.
- **Gestión de riesgo por % de equity.** Dimensionamiento de posición basado en un porcentaje del capital, con *stop* híbrido (estructura + ATR).
- **Salidas escalonadas TP1 / TP2 / TP3.** Cierres parciales por etapas, paso a *break-even* y *trailing* adaptado a cada modo.
- **Dashboard en pantalla.** Panel con el estado del modo, preset, perfil, *score* y métricas de la operación en curso.
- **Alertas webhook en JSON.** Mensajes estructurados listos para integraciones de ejecución automatizada.

---

## 🧠 ¿Cómo funciona?

La estrategia evalúa cada barra a través de un *pipeline* de decisión por etapas:

1. **Filtro HTF.** Confirma la dirección dominante usando una temporalidad superior antes de considerar cualquier entrada.
2. **Régimen y sesión.** Filtra por condiciones de mercado (tendencia/volatilidad vía ADX y bandas de ATR%) y por la ventana horaria de la sesión.
3. **Scoring 0–10.** Pondera las señales técnicas (EMA, MACD, RSI, volumen, etc.) en una puntuación; la entrada exige superar el `Min_Score` efectivo.
4. **Riesgo.** Calcula el tamaño de la posición a partir del riesgo por operación (% de equity) y la distancia al *stop*.
5. **Entrada.** Coloca la orden respetando la dirección permitida (long/short/ambos) y el *cooldown* entre operaciones.
6. **Gestión de salidas.** Administra TP1/TP2/TP3, el paso a *break-even* y el *trailing* según el modo activo.

---

## 🚀 Instalación y uso

1. Abre el **Pine Editor** en [TradingView](https://www.tradingview.com/).
2. Copia el contenido de [`cb-swing-pro-v12.pine`](./cb-swing-pro-v12.pine) y pégalo en el editor.
3. Pulsa **Add to chart / Añadir al gráfico**.
4. Deja el parámetro **Modo = Auto** para que la estrategia detecte *Swing* o *Day* según tu temporalidad.
5. Elige el **preset del activo** (BTC / ETH / SOL / ORO / CUSTOM) que vayas a operar.
6. Abre el **Strategy Tester** con un **capital inicial representativo** para que el dimensionamiento por % de equity sea significativo.

---

## ⚙️ Parámetros principales

| Grupo | Descripción |
|-------|-------------|
| **A. Preset** | Selección de activo (BTC/ETH/SOL/ORO/CUSTOM), perfil de agresividad y dirección permitida. |
| **H. Modo** | Selector del modo operativo: *Auto*, *Swing* o *Day*. |
| **J. Modo Day** | Defaults del modo *Day*: HTF intradía, TPs más cercanos, *trailing* ajustado y `Min_Score` más laxo. |
| **K. Modo Swing** | Defaults del modo *Swing*: HTF superior, TPs más amplios, *trailing* amplio y `Min_Score` más estricto. |
| **N. Riesgo** | Riesgo por operación (% de equity), exposición máxima y configuración del *stop* híbrido. |
| **I. Backtest** | Capital inicial, comisión por operación, *slippage* y procesamiento de órdenes al cierre. |

> El valor efectivo de cada parámetro sigue la precedencia **CUSTOM del usuario → override del preset por modo → default del modo**.

---

## 📊 Validación y backtesting

La estrategia está pensada para validarse sobre una **matriz de escenarios**:

| Eje | Valores |
|-----|---------|
| **Activo** | BTC · ETH · SOL |
| **Modo** | Swing · Day |
| **Perfil** | Conservador · Balanceado · Agresivo |

> ⚠️ Los valores objetivo de cada calibración son **objetivos de ajuste (calibration objectives)**, **no garantías de rendimiento**. El comportamiento histórico no anticipa resultados futuros. Realiza siempre tus propias pruebas con datos y condiciones realistas (comisiones, *slippage* y capital representativo).

---

## ⚠️ Aviso de riesgo

Este proyecto se publica con fines **educativos e informativos**. **No constituye asesoramiento financiero, de inversión ni de trading.** Operar en los mercados financieros conlleva un riesgo elevado de pérdida y puede no ser adecuado para todos los perfiles. Eres el único responsable de tus decisiones. Opera siempre con capital que puedas permitirte perder y consulta a un profesional acreditado si lo necesitas.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

---

<p align="center"><sub>Hecho con 📈 y Pine Script · CB Swing Pro v12</sub></p>
