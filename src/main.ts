import { pauseGame, startGame } from "./gamelogic"
import { GAME_AREA_ID, SCORE_ID } from "./ids"
import {
  gameAreaSize,
  isGameOver,
  isRunning,
  setNewDirection,
  setupGameArea,
  setupSnek,
} from "./state"
import "./style.css"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>snek</h1>
    <h2>Score: <span id=${SCORE_ID}>0</span></h2>
    <div class="area" id="${GAME_AREA_ID}" style="grid-template-columns: repeat(${gameAreaSize}, 1fr)">
    </div>
  </div>
`

function init() {
  setupGameArea()
  setupSnek()
  setupEventHandlers()

  startGame()
}

init()

function getDirection(key: string) {
  switch (key) {
    case "ArrowUp": // eslint-disable-line unicorn/switch-case-braces
      return "up"
    case "ArrowDown": // eslint-disable-line unicorn/switch-case-braces
      return "down"
    case "ArrowLeft": // eslint-disable-line unicorn/switch-case-braces
      return "left"
    default: // eslint-disable-line unicorn/switch-case-braces
      return "right"
  }
}

function setupEventHandlers() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (isRunning()) {
        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight": {
            event.preventDefault()
            setNewDirection(getDirection(event.key))
            break
          }

          case "Enter":
          case " ": {
            event.preventDefault()
            pauseGame()
            break
          }

          default:
        }
      } else if ([" ", "Enter"].includes(event.key)) {
        event.preventDefault()
        if (isGameOver()) {
          setupGameArea()
          setupSnek()
        }

        startGame()
      }
    },
    { capture: true }
  )
}
