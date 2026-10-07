/**
 * components/Card.jsx — COMPONENTE de presentación: una carta pokemon.
 *
 * Un componente es una función que recibe `props` (datos de entrada, de solo
 * lectura) y devuelve JSX (HTML dentro de JavaScript).
 *
 * Librería popular usada: framer-motion. Anima la propiedad `rotateY`
 * para dar el efecto de voltear la carta, con muy poco código.
 *
 * PropTypes valida los tipos de las props y documenta qué espera el componente.
 */
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import './Card.css'

function Card({ card, isFlipped, isMatched, onClick }) {
  // Una carta se ve de frente si está volteada o ya fue emparejada.
  const faceUp = isFlipped || isMatched

  return (
    <button
      className={`card ${isMatched ? 'card--matched' : ''}`}
      onClick={() => onClick(card.uid)} // evento: avisamos al padre qué carta se tocó
      aria-label={faceUp ? card.name : 'Carta oculta'}
    >
      {/* motion.div = <div> que sabe animarse. `animate` indica el estado final. */}
      <motion.div
        className="card__inner"
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Reverso (se ve cuando la carta está oculta) */}
        <div className="card__face card__back">
          <span>?</span>
        </div>

        {/* Frente: marco + imagen + nombre */}
        <div className="card__face card__front">
          <div className="card__frame">
            <img src={card.image} alt={card.name} loading="lazy" />
          </div>
          <h3 className="card__name">{card.name}</h3>
        </div>
      </motion.div>
    </button>
  )
}

Card.propTypes = {
  card: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  isFlipped: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Card