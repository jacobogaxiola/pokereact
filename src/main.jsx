/**
 * main.jsx — PUNTO DE ENTRADA de la aplicación.
 *
 * Aquí React "se conecta" con el HTML: busca el <div id="root"> de index.html
 * y dibuja dentro de él el componente raíz <App />.
 *
 * <StrictMode> es un ayudante para desarrollo: ejecuta ciertas cosas dos veces
 * para ayudarte a detectar errores. No afecta a la versión final.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)