import { GAME_AREA_ID } from "./ids"
import {
  type Direction,
  type Food,
  type Point,
  type Snake as Snek,
} from "./types"

const isRunning = false
const isGameOver = false

let currentScore = 0
const highScore = 0

let snek: Snek = []
let food: Food | undefined
let direction: Direction = "right"
const speed = 50

let gameAreaElements: HTMLDivElement[] | undefined
export const gameAreaSize = 12

export function setupGameArea() {
  const gameArea = document.querySelector("#" + GAME_AREA_ID)!
  gameArea.innerHTML = ""
  const elements = []
  for (let i = 0; i < gameAreaSize * gameAreaSize; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    gameArea.append(cell)
    elements.push(cell)
  }

  gameAreaElements = elements
}

function setFood() {
  if (!gameAreaElements) throw new Error("Game area elements not set")

  if (food) {
    gameAreaElements[pointToIndex(food)].classList.remove("food")
  }

  const freeFields = gameAreaElements
    .map((element, index) => ({
      index,
      isFree: !element.classList.contains("snek"),
    }))
    .filter((field) => field.isFree)

  const randomElement =
    freeFields[Math.floor(Math.random() * freeFields.length)]

  food = indexToPoint(randomElement.index)
  gameAreaElements[pointToIndex(food)].classList.add("food")
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
