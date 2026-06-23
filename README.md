# 📈 Estrategia de Trading con Pine Script

> **CB Swing Pro v13.1 (Quant Pullback)** — Estrategia cuantitativa para TradingView con modos *Swing* y *Day* auto-detectados, entradas por *pullback-continuación*, filtro anti-rango y gestión de riesgo profesional.

![Pine Script](https://img.shields.io/badge/Pine%20Script-v6-2962FF?logo=tradingview&logoColor=white)
![Plataforma](https://img.shields.io/badge/Plataforma-TradingView-131722?logo=tradingview&logoColor=white)
![Versión](https://img.shields.io/badge/Versi%C3%B3n-v13.1-blueviolet.svg)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)
![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen.svg)

**CB Swing Pro v13.1** es una estrategia escrita en **Pine Script v6** para el *Strategy Tester* de **TradingView**. Es una reescritura centrada en la **calidad de entrada**: en lugar de entrar por cruces tardíos de medias, busca el **retroceso (pullback) a la media con confirmación de giro y ruptura**, evita explícitamente los rangos y confirma la tendencia macro por la pendiente de la EMA200 y un filtro de temporalidad superior (HTF) sin repintado. Todo ello calibrado con **presets por activo** (BTC, ETH, SOL, ORO) y perfiles de agresividad.

> 📘 **¿Es tu primera vez?** Lee la **[Guía fácil para principiantes (explicada para todos)](GUIA.md)**.

---

## 📑 Tabla de contenidos

- [✨ Características](#-características)
- [🧠 ¿Cómo funciona?](#-cómo-funciona)
- [🚀 Instalación y uso](#-instalación-y-uso)
- [⚙️ Parámetros principales](#️-parámetros-principales)
- [🎛️ Presets por activo](#️-presets-por-activo)
- [📊 Validación y backtesting](#-validación-y-backtesting)
- [⚠️ Aviso de riesgo](#️-aviso-de-riesgo)
- [📄 Licencia](#-licencia)

---

## ✨ Características

- **Entradas por pullback-continuación.** No entra al cruzar la media (tarde); entra cuando el precio retrocede a la EMA20/50 y **gira con confirmación** (RSI al alza, histograma MACD girando y ruptura de la vela previa).
- **Filtro anti-rango.** Si las EMA20 y EMA50 están demasiado juntas (compresión medida en ATR) → es rango → **no opera**. Elimina la mayoría de pérdidas por *chop*.
- **Macro por pendiente de EMA200 + HTF sin repintado.** Reacciona antes que el clásico cruce 50/200 y confirma con la temporalidad superior usando `lookahead_off` y `[1]` (sin mirar al futuro).
- **Modos Swing y Day auto-detectados.** ≤ 60 min → *Day* (HTF 4H); > 60 min → *Swing* (HTF Diario). También se fija manualmente.
- **Presets por activo.** Calibraciones listas para **BTC, ETH, SOL, ORO** y un perfil **CUSTOM** configurable.
- **Perfiles de agresividad.** *Conservador*, *Balanceado* y *Agresivo* que modulan el `Min_Score` y el riesgo por operación.
- **Gestión de riesgo por % de equity.** Tamaño de posición por porcentaje del capital, con *stop* híbrido (estructura + ATR con *clamp*) y cap de exposición.
- **Salidas escalonadas que dejan correr ganadores.** TP1 a 1.0R cerrando 40%, TP2 30%, *runner* 30% a TP3 con *trailing* Chandelier y *break-even* +0.2R tras TP1.
- **Visual limpio.** SL/TP solo se dibujan con posición abierta, una etiqueta discreta por entrada y un panel compacto de estado.
- **Alertas.** Condiciones de alerta listas para *long* y *short*.

---

## 🧠 ¿Cómo funciona?

La estrategia evalúa cada barra confirmada a través de un *pipeline* por etapas:

1. **Régimen.** Exige tendencia (ADX ≥ umbral), **no-rango** (separación mínima de EMAs en ATR) y volatilidad en banda (ATR%).
2. **Macro + HTF.** La macro-tendencia se confirma por precio vs EMA200 y su pendiente; el HTF confirma la dirección sin repintado.
3. **Disparo por pullback.** Retroceso reciente a la EMA20 + giro de momentum (RSI/MACD) + ruptura de continuación.
4. **Scoring 0–10.** Pondera tendencia, macro, HTF, MACD, RSI, volumen y disparo; la entrada exige superar el `Min_Score` efectivo.
5. **Riesgo.** Calcula el tamaño desde el riesgo por operación (% de equity) y la distancia al *stop* híbrido, respetando el cap de exposición.
6. **Salidas.** Administra TP1/TP2/TP3, paso a *break-even*, *trailing* Chandelier y una salida defensiva por pérdida de momentum antes de TP1.

---

## 🚀 Instalación y uso

1. Abre el **Pine Editor** en [TradingView](https://www.tradingview.com/).
2. Copia el contenido de [`cb-swing-pro-v13.pine`](./cb-swing-pro-v13.pine) y pégalo en el editor.
3. Pulsa **Add to chart / Añadir al gráfico**. Confirma que arriba a la izquierda del gráfico se lee **`CB v13.1 Quant`**.
4. **Importante:** si actualizaste desde una versión anterior, pulsa **"Restablecer ajustes"** en el *Strategy Tester* para que tome los presets nuevos.
5. Deja **Modo = Auto** para detectar *Swing* o *Day* según tu temporalidad.
6. Elige el **preset del activo** (BTC / ETH / SOL / ORO / CUSTOM).
7. Abre el **Strategy Tester** con un **capital inicial representativo** para que el dimensionamiento por % de equity sea significativo.

---

## ⚙️ Parámetros principales

| Grupo | Descripción |
|-------|-------------|
| **1. Modo** | Selector del modo operativo: *Auto*, *Swing* o *Day*. |
| **2. Preset** | Activo (BTC/ETH/SOL/ORO/CUSTOM), perfil de agresividad y dirección permitida. |
| **3. CUSTOM** | Parámetros del activo CUSTOM (HTF, ADX, Min_Score, banda ATR%, riesgo). |
| **4. Régimen** | Filtro anti-rango: separación mínima de EMAs (xATR). |
| **5. Entrada** | Ventana de *pullback* (barras). |
| **6. Sesión** | Ventana horaria UTC y bloqueo opcional fuera de sesión (modo Day). |
| **7. Riesgo** | Riesgo por operación (% de equity), *stop* híbrido (estructura/ATR con *clamp*), apalancamiento y exposición máxima. |
| **8. Visual** | Mostrar SL/TP en posición y fondo de régimen. |

> El valor efectivo de cada parámetro sigue la precedencia **CUSTOM del usuario → preset por activo → default del modo**.

---

## 🎛️ Presets por activo

| Activo | ADX mín. (Day/Swing) | Min Score | Riesgo % | Volumen | Dirección | Notas |
|--------|----------------------|-----------|----------|---------|-----------|-------|
| **BTC** | 15 / 18 | 5–6 | 1.0% | Sí | AMBOS | Tendencia macro + pullback |
| **ETH** | 16 / 19 | 5–6 | 0.8% | Sí | AMBOS | Algo más estricto que BTC |
| **SOL** | 20 / 24 | 6–7 | 0.5% | Sí | AMBOS | Más estricto, menor tamaño, *cooldown* mayor |
| **ORO** | 14 / 17 | 5–6 (short +2) | 0.8% | Ignorado | LONG | Shorts muy restringidos |

> El **perfil** modula: *Conservador* sube `Min_Score` +1 y baja el riesgo ×0.75; *Agresivo* hace lo contrario. En **1h** se activa *Day* (HTF 4H); en **Diario**, *Swing* (HTF Diario).

---

## 📊 Validación y backtesting

Valida sobre una **matriz de escenarios** (activo × modo × perfil):

| Eje | Valores |
|-----|---------|
| **Activo** | BTC · ETH · SOL · ORO |
| **Modo** | Swing · Day |
| **Perfil** | Conservador · Balanceado · Agresivo |

> ⚠️ **Pine Script no lee archivos CSV.** Los históricos usados en el desarrollo sirvieron para **calibración *offline*** (entender volatilidad y drawdowns de cada activo); la validación real se hace en el *Strategy Tester* de TradingView con sus datos. **PF > 2.0 es un objetivo de calibración, NO una garantía.** Win rate realista **55–70%**. El comportamiento histórico no anticipa resultados futuros; prueba siempre con comisiones, *slippage* y capital representativo.

---

## ⚠️ Aviso de riesgo

Este proyecto se publica con fines **educativos e informativos**. **No constituye asesoramiento financiero, de inversión ni de trading.** Operar conlleva un riesgo elevado de pérdida y puede no ser adecuado para todos los perfiles. Eres el único responsable de tus decisiones. Opera siempre con capital que puedas permitirte perder y consulta a un profesional acreditado si lo necesitas.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.

---

<p align="center"><sub>Hecho con 📈 y Pine Script · CB Swing Pro v13.1 (Quant Pullback)</sub></p>
