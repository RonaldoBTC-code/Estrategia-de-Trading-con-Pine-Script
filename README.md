# CB Swing Pro v12

Estrategia en **Pine Script v6** para **TradingView** orientada a operativa cuantitativa con presets por activo.

## Características

- **Dos modos auto-detectados (Swing / Day):** el modo se deduce automáticamente según la temporalidad del gráfico (≤ 60 min → Day; > 60 min → Swing), o puede fijarse manualmente.
- **Presets por activo:** calibraciones específicas para **BTC**, **ETH**, **SOL**, **ORO** y un modo **CUSTOM** totalmente configurable.
- **Perfiles de agresividad:** CONSERVADOR, BALANCEADO y AGRESIVO, que modulan el `Min_Score` y el riesgo por operación.
- **Gestión de riesgo por % de equity:** dimensionamiento de posición basado en un porcentaje del capital, con **stop híbrido** (estructura + ATR).
- **Salidas parciales TP1 / TP2 / TP3:** cierres escalonados con **break-even** automático y **trailing stop** adaptado a cada modo.
- **Dashboard** en el gráfico con el estado de la estrategia (modo activo, activo, perfil, dirección).
- **Alertas webhook** con payload en formato **JSON**, listas para automatización.

## Guía rápida de uso

1. Abre el **Pine Editor** de TradingView y carga el archivo `cb-swing-pro-v12.pine`.
2. Añade la estrategia al gráfico.
3. En los ajustes, deja el selector de **Modo** en **Auto** (o elige Swing/Day manualmente).
4. Selecciona el **preset del activo** que vas a operar (BTC / ETH / SOL / ORO / CUSTOM).
5. Ajusta, si lo deseas, el **perfil de agresividad** y los parámetros de riesgo.

## Nota importante

Los resultados de backtest incluidos o referenciados son **objetivos de calibración**, no garantías de rendimiento futuro. El comportamiento real puede diferir según las condiciones de mercado, la liquidez, las comisiones y el slippage. Realiza tus propias pruebas antes de operar con capital real.
