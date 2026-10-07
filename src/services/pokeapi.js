/**
 * services/pokeapi.js — CAPA DE SERVICIOS
 *
 * Separar el acceso a datos de los componentes es una buena práctica:
 * los componentes solo "dibujan", y este módulo sabe "cómo pedir datos".
 * Si mañana cambiamos de API, solo editamos este archivo.
 */

const API_URL = 'https://pokeapi.co/api/v2'

// La PokeAPI tiene ~1000 pokemons con ids consecutivos. Usamos los primeros 898 (con buen arte).
const MAX_POKEMON_ID = 898

/**
 * Pide a la PokeAPI `count` pokemons distintos y al azar.
 * @param {number} count - cuántos pokemons distintos necesitamos
 * @returns {Promise<Array<{id:number, name:string, image:string}>>}
 *
 * `async/await` nos permite escribir código asíncrono (que espera a la red)
 * como si fuera secuencial.
 */
export async function fetchRandomPokemons(count) {
  // Set = colección sin repetidos. Así garantizamos pokemons distintos.
  const ids = new Set()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1)
  }

  // Promise.all lanza todas las peticiones EN PARALELO y espera a que terminen.
  const pokemons = await Promise.all(
    [...ids].map(async (id) => {
      const response = await fetch(`${API_URL}/pokemon/${id}`)
      if (!response.ok) throw new Error(`Error ${response.status} al pedir el pokemon ${id}`)
      const data = await response.json()

      // Nos quedamos solo con lo que necesitamos de la gran respuesta JSON.
      return {
        id: data.id,
        name: data.name,
        image:
          data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
      }
    }),
  )
  return pokemons
}