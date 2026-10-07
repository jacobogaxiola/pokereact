/**
 * components/Board.jsx — COMPONENTE contenedor del tablero.
 *
 * Conceptos:
 *  - Renderizado de listas: `cards.map(...)` crea un <Card> por cada elemento.
 *  - `key`: identificador único que React usa para saber qué elemento cambió.
 *  - "Levantar el estado": Board NO guarda estado; recibe todo por props
 *    desde App y solo se lo reparte a las cartas.
 */
import PropTypes from 'prop-types'
import Card from './Card'
import './Board.css'

function Board({ cards, flipped, matched, onCardClick }) {
  return (
    <div className="board">
      {cards.map((card) => (
        <Card
          key={card.uid}
          card={card}
          isFlipped={flipped.includes(card.uid)}
          isMatched={matched.includes(card.pairId)}
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}

Board.propTypes = {
  cards: PropTypes.array.isRequired,
  flipped: PropTypes.array.isRequired,
  matched: PropTypes.array.isRequired,
  onCardClick: PropTypes.func.isRequired,
}

export default Board