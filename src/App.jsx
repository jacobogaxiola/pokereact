/**
 * App.jsx — COMPONENTE RAÍZ.
 *
 * Reúne los módulos: obtiene el estado del juego del hook `useMemoryGame`
 * y se lo pasa a los componentes hijos (flujo de datos unidireccional).
 *
 * Conceptos:
 *  - Renderizado condicional: mostramos carga, error o tablero según el estado.
 *  - useState para la dificultad: cambiar el número de pares redibuja todo.
 *  - react-confetti (librería popular) celebra la victoria.
 */
import { useState } from 'react'
import Confetti from 'react-confetti'
import Board from './components/Board'
import ScoreBoard from './components/ScoreBoard'
import { useMemoryGame } from './hooks/useMemoryGame'
import './App.css'

function App() {
  const [pairCount, setPairCount] = useState(6) // dificultad: número de pares
  const { cards, flipped, matched, moves, loading, error, isWon, flipCard, restart } =
    useMemoryGame(pairCount)

  return (
    <main className="app">
      <h1>Memoria Pokémon</h1>

      <label className="difficulty">
        Dificultad:{' '}
        {/* Input controlado: su valor vive en el estado de React */}
        <select value={pairCount} onChange={(e) => setPairCount(Number(e.target.value))}>
          <option value={4}>Fácil (4 pares)</option>
          <option value={6}>Normal (6 pares)</option>
          <option value={8}>Difícil (8 pares)</option>
        </select>
      </label>

      <ScoreBoard moves={moves} found={matched.length} total={pairCount} onRestart={restart} />

      {/* Renderizado condicional con operadores && y ternario */}
      {loading && <p>Cargando pokemons…</p>}
      {error && <p className="error">⚠️ {error}</p>}
      {!loading && !error && (
        <Board cards={cards} flipped={flipped} matched={matched} onCardClick={flipCard} />
      )}

      {isWon && (
        <>
          <Confetti recycle={false} numberOfPieces={400} />
          <p className="win">🎉 ¡Ganaste en {moves} intentos!</p>
        </>
      )}
    </main>
  )
}

export default App