# 🧸 Guía fácil de CB Swing Pro v12 (explicada para todos)

Imagina que esta estrategia es un **robot ayudante** que mira el precio de una moneda (como Bitcoin) y decide cuándo es buen momento para **comprar** o **vender**. Esta guía te explica, con palabras muy sencillas, **para qué sirve**, **qué hace cada botón del menú** y **qué son los modos**.

> 💡 No necesitas saber de programación. Solo lee con calma. 🙂

---

## ⏱️ 1. ¿Qué es la "temporalidad" y cuál debo usar?

En el gráfico, el precio se dibuja con **velitas**. Cada vela es como una **foto** que dura un ratito:

- Una vela de **15m** = una foto de **15 minutos**.
- Una vela de **1H** = una foto de **1 hora**.
- Una vela de **1D** = una foto de **1 día entero**.

👉 La **temporalidad** es cuánto dura cada foto. Y según la temporalidad, el robot trabaja de dos maneras:

| Si usas velas de... | El robot opera... | Estilo |
|---|---|---|
| 1m, 5m, 15m, 30m, 1H | Rápido, varias veces al día | 🏃 **Day trade** (día) |
| 4H, 1 día (1D), 1 semana | Con calma, operaciones largas | 🥾 **Swing** (varios días) |

✅ **Lo mejor:** no tienes que elegir tú. El robot **detecta solo** qué temporalidad estás usando (modo **Auto**) y se adapta.

**Recomendado para empezar:**
- 🏃 Day trade: gráficos de **15m** o **1H**.
- 🥾 Swing: gráficos de **4H** o **1D** (diario).

---

## 🤖 2. Los dos modos (¡la parte más importante!)

### 🏃 Modo Day (día) — el corredor de velocidad
- Hace operaciones **cortas y rápidas**.
- Pone metas de ganancia **cerca** y el freno (stop) **ajustado**.
- Se usa en gráficos de **minutos hasta 1 hora**.
- Es como correr los 100 metros: rápido y de poca distancia.

### 🥾 Modo Swing (varios días) — el excursionista
- Hace operaciones **largas y tranquilas**.
- Pone metas de ganancia **lejos** y deja **correr** la ganancia.
- Se usa en gráficos de **4 horas o 1 día**.
- Es como una excursión a la montaña: lento pero llega lejos.

### 🪄 Modo Auto — el robot elige por ti
- Si tu gráfico usa velas de **60 minutos o menos** → elige **Day**.
- Si usa velas de **más de 60 minutos** (4H, diario, semanal) → elige **Swing**.
- Así no tienes que cambiar nada cuando saltas de un gráfico a otro. 🎉

---

## 📋 3. El menú, botón por botón (en orden)

Cuando añades la estrategia, al pulsar el engranaje ⚙️ verás grupos de opciones. Aquí van explicados fácil:

### A. Preset (lo básico) ⭐
- **Activo:** elige la moneda: **BTC**, **ETH**, **SOL**, **ORO** o **CUSTOM** (a tu medida). Cada una ya viene con ajustes hechos a su carácter.
- **Perfil:** cómo de atrevido es el robot:
  - 😌 **Conservador** = prudente (opera menos, más seguro).
  - 🙂 **Balanceado** = equilibrio (recomendado para empezar).
  - 😎 **Agresivo** = atrevido (opera más, más riesgo).
- **Dirección:** si solo **compra** (LONG), solo **vende** (SHORT) o **ambas**.

### B y C. CUSTOM (solo si eliges "CUSTOM")
- Son los ajustes "a tu medida". Si elegiste BTC/ETH/SOL/ORO, **puedes ignorar estos grupos**.

### H. Modo 🤖
- Aquí eliges **Auto**, **Swing** o **Day**. Déjalo en **Auto** y listo.

### I. Backtest (la prueba) 🧪
- **Capital inicial:** el dinero de mentira con el que se hace la prueba.
- **Comisión y slippage:** los "gastos" que cobra el mercado.
- 👉 Estos también se pueden cambiar en la pestaña **"Propiedades"** del Strategy Tester.

### J. Modo Day y K. Modo Swing 🎯
- Son los ajustes propios de cada modo: dónde poner las metas (TP), el freno que persigue al precio (trailing), cuán exigente es para entrar, las horas y el riesgo. Vienen ya bien puestos por defecto.

### L. Sesión 🕒
- A **qué horas** se permite operar (en horario UTC). Por defecto está abierto siempre.

### M. Estructura y Scoring 🧠
- Cómo de **exigente** es el robot para dar el "sí" a una operación. Cuanto más alto, más selectivo.

### N. Riesgo 🛡️
- **Riesgo por operación:** cuánto dinero arriesga cada vez (un % pequeño).
- **Apalancamiento:** una "palanca" que multiplica (¡también el riesgo!). Úsalo con cuidado.
- **Stop:** el freno de emergencia.

### O. Visualización 👀
- Mostrar u ocultar dibujos: las líneas (EMAs), los niveles de meta/stop y el panel de información.

### P. Webhooks 🔔
- Avisos automáticos en un formato especial (JSON) para conectar con bots. Para usuarios avanzados; por defecto está apagado.

### Q. Debug 🧰
- Un panel de "auto-revisión" que comprueba que todo funciona bien. Opcional.

---

## 🎯 4. ¿Cómo gana o se protege? (palabras fáciles)

- 🛑 **Stop (SL):** el **freno de emergencia**. Si el precio va en contra, el robot sale para **no perder mucho**.
- 🥇🥈🥉 **TP1 / TP2 / TP3:** son **tres metas** de ganancia. El robot vende **por partes** (un trozo en cada meta), para asegurar beneficios poco a poco.
- 🟰 **Break-even:** cuando llega a la **primera meta**, mueve el freno **al punto de entrada**. A partir de ahí, **ya no puede perder** en esa operación. 🎉
- 🪝 **Trailing:** cuando llega a la **segunda meta**, el freno **persigue** al precio para **asegurar** más ganancia si sigue subiendo.

---

## 🚦 5. El panel que ves en el gráfico (arriba a la derecha)

Es un cartelito con la "salud" de la estrategia:
- **Modo:** Day o Swing (y si fue Auto o manual).
- **Preset / Perfil / Dirección:** lo que elegiste.
- **Estado:** si está esperando, comprado (LONG) o vendido (SHORT).
- **Score L/S:** una "nota" del 0 al 10 para comprar (L) o vender (S). Más alto = mejor señal.
- **ADX / ATR%:** fuerza de la tendencia y cuánta "agitación" hay.
- **HTF:** lo que dice la temporalidad grande (alcista/bajista).
- **PF / WR / Net PnL:** resultados de la prueba (cuánto gana vs pierde, % de aciertos y ganancia total).

---

## 🧪 6. Cómo probarla (paso a paso)

1. Copia el código del archivo `cb-swing-pro-v12.pine`.
2. En **TradingView**, abre el **Pine Editor** (abajo).
3. Borra lo que haya y **pega** el código.
4. Pulsa **"Add to chart"** (Añadir al gráfico).
5. Abre la pestaña **"Strategy Tester"** para ver los resultados.
6. Cambia la temporalidad del gráfico (15m, 1H, 4H, 1D) y mira cómo el modo cambia solo. 🪄

---

## ⚠️ 7. Aviso importante

Esto **no es un consejo financiero**. El trading tiene **riesgo real** y puedes perder dinero. Los resultados de las pruebas (backtest) son **objetivos para calibrar**, **no una promesa** de ganancias futuras. Practica primero con dinero de mentira (modo de prueba). 🙏
