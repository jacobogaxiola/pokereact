/**
 * hooks/useMemoryGame.js — HOOK PERSONALIZADO con TODA la lógica del juego.
 *
 * Un "custom hook" es una función cuyo nombre empieza con `use` y que usa
 * otros hooks. Sirve para reutilizar y ORDENAR lógica con estado, dejando
 * a los componentes solo la tarea de mostrar cosas.
 *
 * Hooks de React que se usan aquí:
 *  - useState:   guarda datos que, al cambiar, vuelven a dibujar la pantalla.
 *  - useEffect:  ejecuta "efectos secundarios" (pedir datos, temporizadores).
 *  - useCallback: memoriza una función para que no se cree de nuevo en cada render.
 */
import { useCallback, useEffect, useState } from 'react'
import { fetchRandomPokemons } from '../services/pokeapi'
import { shuffle } from '../utils/shuffle'

/** Construye el mazo: cada pokemon se duplica (el "par") y se baraja. */
function buildDeck(pokemons) {
  const pairs = pokemons.flatMap((p) => [
    // `uid` identifica cada carta física; `pairId` identifica a qué par pertenece.
    { ...p, uid: `${p.id}-a`, pairId: p.id },
    { ...p, uid: `${p.id}-b`, pairId: p.id },
  ])
  return shuffle(pairs)
}

export function useMemoryGame(pairCount) {
  // ---------- ESTADO ----------
  const [cards, setCards] = useState([]) // mazo en el tablero
  const [flipped, setFlipped] = useState([]) // uids de cartas volteadas en este turno (máx. 2)
  const [matched, setMatched] = useState([]) // pairIds de los pares ya encontrados
  const [moves, setMoves] = useState(0) // intentos realizados
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [round, setRound] = useState(0) // al aumentar, se reinicia el juego

  // ---------- EFECTO 1: cargar el mazo ----------
  // Se ejecuta al montar el componente y cada vez que cambian `pairCount` o `round`
  // (la lista de dependencias [..] indica cuándo debe volver a ejecutarse).
  useEffect(() => {
    let cancelled = false // evita actualizar estado si el componente ya no existe

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const pokemons = await fetchRandomPokemons(pairCount)
        if (cancelled) return
        setCards(buildDeck(pokemons))
        setFlipped([])
        setMatched([])
        setMoves(0)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()

    // Función de limpieza: React la llama antes de repetir el efecto o al desmontar.
    return () => {
      cancelled = true
    }
  }, [pairCount, round])

  // ---------- EFECTO 2: comparar las dos cartas volteadas ----------
  useEffect(() => {
    if (flipped.length !== 2) return

    const [first, second] = flipped.map((uid) => cards.find((c) => c.uid === uid))
    setMoves((m) => m + 1) // forma funcional: usa el valor más reciente

    if (first.pairId === second.pairId) {
      // ¡Par! Lo guardamos y liberamos el turno.
      setMatched((m) => [...m, first.pairId]) // nunca hacemos m.push(): creamos arreglo nuevo
      setFlipped([])
    } else {
      // No coinciden: esperamos 1 segundo para que el jugador las vea y las volteamos.
      const timer = setTimeout(() => setFlipped([]), 1000)
      return () => clearTimeout(timer) // limpieza del temporizador
    }
  }, [flipped, cards])

  // ---------- ACCIONES ----------
  const flipCard = useCallback(
    (uid) => {
      const card = cards.find((c) => c.uid === uid)
      const isBusy = flipped.length >= 2 // ya hay 2 cartas esperando comparación
      const isAlreadyUp = flipped.includes(uid) || matched.includes(card.pairId)
      if (isBusy || isAlreadyUp) return
      setFlipped((f) => [...f, uid])
    },
    [cards, flipped, matched],
  )

  const restart = useCallback(() => setRound((r) => r + 1), [])

  // ---------- VALORES DERIVADOS ----------
  // No necesitan su propio useState: se calculan a partir del estado existente.
  const isWon = cards.length > 0 && matched.length === pairCount

  return { cards, flipped, matched, moves, loading, error, isWon, flipCard, restart }
}