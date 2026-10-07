/**
 * utils/shuffle.js — FUNCIÓN PURA de utilidad.
 *
 * Una función pura siempre devuelve lo mismo para los mismos datos de entrada
 * y NO modifica lo que recibe. Esto es importante en React: el estado
 * nunca se debe mutar, siempre se crean copias nuevas.
 *
 * Algoritmo Fisher-Yates: recorre el arreglo de atrás hacia adelante
 * intercambiando cada elemento con otro en una posición aleatoria.
 */
export function shuffle(array) {
  const copy = [...array] // copia: no tocamos el original
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}