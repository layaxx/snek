import {
  restartIfNeeded,
  pauseGame,
  startGame,
  togglePauseStatus,
} from "./gamelogic"
import {
  NAME_INPUT_SELECTOR,
  SPEED_SLIDER_SELECTOR,
  SPEED_DISPLAY_SELECTOR,
  PAUSE_BUTTON_SELECTOR,
} from "./ids"
import { updateName } from "./scoreboard"
import {
  defaultSpeed,
  setNewSpeed,
  isRunning,
  setNewDirection,
  isGameOver,
  setupGameArea,
  setupSnek,
} from "./state"
import { type Direction } from "./types"

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

let touchstart = { x: 0, y: 0 }
let touchend = { x: 0, y: 0 }
let startPosition = { x: 0, y: 0 }
function stopScroll() {
  window.scrollTo(startPosition.x, startPosition.y)
}

function checkDirection(): Direction {
  const deltaX = touchend.x - touchstart.x
  const deltaY = touchend.y - touchstart.y

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left"
  }

  return deltaY > 0 ? "down" : "up"
}

export function setupEventHandlers() {
  document
    .querySelector<HTMLInputElement>(NAME_INPUT_SELECTOR)
    ?.addEventListener("change", (event) => {
      const inputElement = event.currentTarget as HTMLInputElement
      updateName(inputElement.value)
    })
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
  document.addEventListener("touchstart", (event) => {
    touchstart = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }
    startPosition = { x: window.scrollX, y: window.scrollY }
    if (isRunning()) window.addEventListener("scroll", stopScroll)
  })
  document.addEventListener("touchend", (event) => {
    touchend = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }

    if (isRunning()) setNewDirection(checkDirection())

    window.removeEventListener("scroll", stopScroll)
  })
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseGame()
    }
  })
  document
    .querySelector<HTMLButtonElement>(PAUSE_BUTTON_SELECTOR)
    ?.addEventListener("click", () => {
      togglePauseStatus()
    })
}
