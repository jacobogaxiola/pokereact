# Memoria Pokémon (React + Vite)

Juego de memoria (pares) con cartas de Pokémon obtenidas de la [PokeAPI](https://pokeapi.co/). Es una app **didáctica** para aprender los conceptos básicos de React: cada archivo está comentado en español.

## Cómo ejecutarla

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # versión de producción en dist/
npm run lint     # revisión de código con oxlint
```

Requiere conexión a internet (las imágenes y datos vienen de la PokeAPI).

## Cómo se juega

1. Se muestra un tablero con cartas boca abajo (reverso tipo pokebola).
2. Toca dos cartas por turno. Si son el mismo Pokémon, quedan descubiertas (con brillo verde).
3. Si no coinciden, se ocultan de nuevo tras 1 segundo.
4. Gana quien encuentra todos los pares; se muestra confeti y el total de intentos.
5. Se puede cambiar la dificultad (4, 6 u 8 pares) y reiniciar con **Nuevo juego**.

## Estructura del proyecto

```
index.html                 Página base con <div id="root">
src/
├── main.jsx               Punto de entrada: monta <App /> en el HTML
├── App.jsx / App.css      Componente raíz: dificultad, carga/error, victoria
├── index.css              Estilos globales
├── components/
│   ├── Board.jsx/.css     Tablero: renderiza la lista de cartas
│   ├── Card.jsx/.css      Carta con marco, imagen, nombre y animación de giro
│   └── ScoreBoard.jsx     Intentos, pares encontrados y botón de reinicio
├── hooks/
│   └── useMemoryGame.js   Hook personalizado con toda la lógica del juego
├── services/
│   └── pokeapi.js         Acceso a la PokeAPI (fetch)
└── utils/
    └── shuffle.js         Función pura para barajar (Fisher-Yates)
```

La app se divide por responsabilidad: **componentes** (qué se ve), **hook** (reglas del juego), **servicio** (datos externos) y **utilidades** (funciones puras).

## Cómo funciona

### Flujo de datos

```
App ──usa──▶ useMemoryGame(pairCount) ──llama──▶ pokeapi.fetchRandomPokemons
 │                  └─ usa shuffle para barajar
 ├─ props ▶ ScoreBoard (moves, found, total, onRestart)
 └─ props ▶ Board (cards, flipped, matched, onCardClick) ─▶ Card × N
```

Los datos bajan por **props**; las acciones suben mediante **funciones callback** (`onCardClick`, `onRestart`). El estado vive en un solo lugar (el hook usado por `App`), lo que se conoce como "levantar el estado".

### Estado del juego (`useMemoryGame`)

| Estado | Contenido |
|--------|-----------|
| `cards` | Mazo barajado; cada pokemon aparece dos veces (`uid` único y `pairId` compartido) |
| `flipped` | `uid` de las cartas volteadas en el turno actual (máx. 2) |
| `matched` | `pairId` de los pares ya encontrados |
| `moves` | Intentos realizados |
| `loading` / `error` | Estado de la petición a la API |
| `round` | Contador que, al aumentar, reinicia la partida |

`isWon` es un **valor derivado** (se calcula, no se guarda en estado).

Dos `useEffect`:
1. **Carga del mazo**: se ejecuta al cambiar `pairCount` o `round`; pide los pokemons, arma y baraja el mazo y reinicia contadores. Su limpieza evita actualizar el estado si el componente ya no existe.
2. **Comparación**: cuando `flipped` tiene 2 cartas, compara sus `pairId`. Si coinciden las agrega a `matched`; si no, un `setTimeout` de 1 s las vuelve a ocultar.

`flipCard` ignora el toque si ya hay 2 cartas esperando o si la carta ya está descubierta.

### Servicio (`pokeapi.js`)

`fetchRandomPokemons(count)` elige `count` ids distintos al azar (usando un `Set`), pide cada pokemon a `/pokemon/{id}` en paralelo con `Promise.all` y devuelve solo `{ id, name, image }` (arte oficial, con sprite como respaldo).

### Componentes

- **App**: guarda la dificultad con `useState` (un `<select>` controlado) y usa renderizado condicional para mostrar carga, error, tablero o mensaje de victoria.
- **Board**: recorre `cards` con `map` y asigna `key={card.uid}`.
- **Card**: botón accesible con dos caras (reverso y frente con marco). La animación de giro es `rotateY` con framer-motion; el CSS (`perspective`, `backface-visibility`) crea el efecto 3D.
- **ScoreBoard**: componente de presentación puro.

## Conceptos de React que ilustra

JSX · componentes y props · `PropTypes` · `useState` · `useEffect` (dependencias y limpieza) · `useCallback` · custom hooks · listas y `key` · renderizado condicional · inputs controlados · estado inmutable · levantar el estado · valores derivados.

## Librerías

| Librería | Uso |
|----------|-----|
| [react](https://react.dev) / react-dom | Interfaz |
| [vite](https://vite.dev) | Servidor y empaquetado |
| [framer-motion](https://www.framer.com/motion/) | Animación de voltear cartas |
| [react-confetti](https://github.com/alampros/react-confetti) | Celebración al ganar |
| [prop-types](https://github.com/facebook/prop-types) | Validación de props |
| [PokeAPI](https://pokeapi.co/) | Datos e imágenes de Pokémon |

## Ideas para ampliar

Temporizador, récord guardado en `localStorage`, selector de generación, sonidos, o pruebas con Vitest para `shuffle` y `useMemoryGame`.
