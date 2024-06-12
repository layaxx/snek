import { GAME_AREA_ID } from "./main"
import { Direction, Food, Point, Snake as Snek } from "./types"

var isRunning = false
var isGameOver = false

var currentScore: number = 0
var highScore: number = 0

var snek: Snek = []
var food: Food | undefined = undefined
var direction: Direction = "right"
var speed: number = 50

var gameAreaElements: HTMLDivElement[] | undefined = undefined
export const gameAreaSize = 12

export function setupGameArea() {
  const gameArea = document.getElementById(GAME_AREA_ID)!
  gameArea.innerHTML = ""
  const elements = []
  for (let i = 0; i < gameAreaSize * gameAreaSize; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    gameArea.appendChild(cell)
    elements.push(cell)
  }

  gameAreaElements = elements
}

function setFood() {
  if (!gameAreaElements) throw new Error("Game area elements not set")

  if (food) {
    gameAreaElements![pointToIndex(food)].classList.remove("food")
  }

  const freeFields = gameAreaElements!
    .map((el, index) => ({
      index,
      isFree: !el.classList.contains("snek"),
    }))
    .filter((field) => field.isFree)

  const randomElement =
    freeFields[Math.floor(Math.random() * freeFields.length)]

  food = indexToPoint(randomElement.index)
  gameAreaElements![pointToIndex(food)].classList.add("food")
}

export function setupSnek() {
  snek = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
  ]
  direction = "right"
  currentScore = 0

  for (const point of snek) {
    gameAreaElements![pointToIndex(point)].classList.add("snek")
  }

  setFood()
}

function pointToIndex({ x, y }: Point): number {
  return y * gameAreaSize + x
}

function indexToPoint(index: number): Point {
  return {
    x: index % gameAreaSize,
    y: Math.floor(index / gameAreaSize),
  }
}
