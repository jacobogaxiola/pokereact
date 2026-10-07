/**
 * components/ScoreBoard.jsx — Barra de estado y control.
 * Componente sencillo: muestra datos recibidos por props y emite un evento
 * (onRestart) hacia el padre. Así fluyen los datos en React:
 * hacia abajo con props, hacia arriba con funciones callback.
 */
import PropTypes from 'prop-types'

function ScoreBoard({ moves, found, total, onRestart }) {
  return (
    <div className="scoreboard">
      <span>Intentos: <strong>{moves}</strong></span>
      <span>Pares: <strong>{found}/{total}</strong></span>
      <button onClick={onRestart}>Nuevo juego</button>
    </div>
  )
}

ScoreBoard.propTypes = {
  moves: PropTypes.number.isRequired,
  found: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
}

export default ScoreBoard