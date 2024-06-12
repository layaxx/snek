import {
  togglePauseStatus,
  pauseGame,
  startGame,
  restartIfNeeded,
} from "./gamelogic"
import {
  GAME_AREA_ID,
  HIGHSCORE_ID,
  PAUSE_BUTTON_ID,
  PAUSE_BUTTON_SELECTOR,
  SCORE_ID,
  SPEED_DISPLAY_ID,
  SPEED_DISPLAY_SELECTOR,
  SPEED_SLIDER_SELECTOR,
} from "./ids"
import {
  defaultSpeed,
  gameAreaSize,
  isGameOver,
  isRunning,
  setNewDirection,
  setNewSpeed,
  setupGameArea,
  setupHighscore,
  setupSnek,
} from "./state"
import "./style.css"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>snek</h1>
    <h2>Score: <span id="${SCORE_ID}">0</span>, Highscore: <span id="${HIGHSCORE_ID}">0</span></h2>
    <button id="${PAUSE_BUTTON_ID}">Pause</button>
    <div class="area" id="${GAME_AREA_ID}" style="grid-template-columns: repeat(${gameAreaSize}, 1fr)">
    </div>

    
    <p>
      slow
      <input type="range" min="10" max="200" value="${defaultSpeed}" class="slider" id="speed-selector">
      fast
      <br />
      <span id="${SPEED_DISPLAY_ID}">${defaultSpeed}</span>
    </p>
  </div>
`

function init() {
  setupHighscore()
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
  document
    .querySelector<HTMLInputElement>(SPEED_SLIDER_SELECTOR)
    ?.addEventListener("change", (event) => {
      const inputElement = event.currentTarget as HTMLInputElement
      const newSpeed = Number.parseInt(inputElement.value, 10) || defaultSpeed
      setNewSpeed(newSpeed)
      restartIfNeeded()

      document.querySelector(SPEED_DISPLAY_SELECTOR)!.textContent =
        String(newSpeed)
    })
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
  document
    .querySelector<HTMLButtonElement>(PAUSE_BUTTON_SELECTOR)
    ?.addEventListener("click", () => {
      togglePauseStatus()
    })
}
