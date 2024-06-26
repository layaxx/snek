import { PAUSE_BUTTON_SELECTOR } from "./ids"
import {
  drawGameOver,
  getSpeed,
  isGameOver,
  isRunning,
  moveSnek,
  setIsRunning,
  setupGameArea,
  setupSnek,
} from "./state"

let intervalID: undefined | ReturnType<typeof setInterval>

function tick() {
  moveSnek()

  if (isGameOver()) {
    pauseGame()
    drawGameOver()
  }
}

export function startGame() {
  tick()
  intervalID = setInterval(tick, 10_000 / getSpeed())
  setIsRunning(true)
  document.querySelector(PAUSE_BUTTON_SELECTOR)!.textContent = "Pause"
}

export function pauseGame() {
  clearInterval(intervalID)
  setIsRunning(false)
  document.querySelector(PAUSE_BUTTON_SELECTOR)!.textContent = isGameOver()
    ? "Restart"
    : "Continue"
}

export function restartIfNeeded() {
  if (isRunning()) {
    clearInterval(intervalID)
    startGame()
  }
}

export function togglePauseStatus() {
  if (isRunning()) {
    pauseGame()
  } else {
    if (isGameOver()) {
      setupGameArea()
      setupSnek()
    }

    startGame()
  }
}
