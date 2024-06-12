import {
  drawGameOver,
  getSpeed,
  isGameOver,
  moveSnek,
  setIsRunning,
} from "./state"

let intervalID: number | undefined

function tick() {
  moveSnek()

  console.log("tick")

  if (isGameOver()) {
    drawGameOver()
    clearInterval(intervalID)
  }
}

export function startGame() {
  intervalID = setInterval(tick, 10_000 / getSpeed())
  setIsRunning(true)
}

export function pauseGame() {
  clearInterval(intervalID)
  setIsRunning(false)
}
