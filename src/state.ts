import {
  GAME_AREA_SELECTOR,
  HIGHSCORE_ID,
  HIGHSCORE_SELECTOR,
  SCORE_SELECTOR,
} from "./ids"
import {
  type Direction,
  type Food,
  type Point,
  type Snake as Snek,
} from "./types"

export const gameAreaSize = 12

let _isRunning = false
let _isGameOver = false

let currentScore = 0
let highScore = 0
let highScoresFromLS: Array<{
  time: string
  score: number
}> = []

let snek: Snek = []
let food: Food = { x: 0, y: 0 }
let direction: Direction = "right"
export const defaultSpeed = 50
let speed = defaultSpeed

let scorecard: Element | undefined
let gameAreaElements: HTMLDivElement[] = []

export function setIsRunning(newValue: boolean) {
  _isRunning = newValue
}

export function isRunning() {
  return _isRunning
}

export function getSpeed() {
  return speed
}

export function isGameOver() {
  return _isGameOver
}

export function setNewSpeed(newSpeed: number) {
  speed = newSpeed
}

function setHighscore(newHighscore: number) {
  highScore = newHighscore

  const highScoreBoard = document.querySelector(HIGHSCORE_SELECTOR)

  if (highScoreBoard) highScoreBoard.textContent = String(newHighscore)
}

export function setupHighscore() {
  const localStorageEntry = localStorage.getItem(HIGHSCORE_ID)

  if (localStorageEntry) {
    try {
      const parsed = JSON.parse(localStorageEntry) as Array<{
        time: string
        score: number
      }>

      highScoresFromLS = parsed

      if (highScoresFromLS.length > 0)
        setHighscore(Math.max(...parsed.map(({ score }) => score)))
      else setHighscore(0)
    } catch {
      localStorage.setItem(HIGHSCORE_ID, JSON.stringify([]))
    }
  } else {
    localStorage.setItem(HIGHSCORE_ID, JSON.stringify([]))
  }
}

export function setupGameArea() {
  const gameArea = document.querySelector(GAME_AREA_SELECTOR)!
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
  ].reverse()
  direction = "right"
  currentScore = 0
  _isGameOver = false
  scorecard = document.querySelector(SCORE_SELECTOR)!
  scorecard.textContent = currentScore.toString()

  for (const point of snek) {
    gameAreaElements[pointToIndex(point)].classList.add("snek")
  }

  gameAreaElements[pointToIndex(snek[0])].classList.add("head")

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

function isHit(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y
}

function increaseScore() {
  currentScore++
  if (scorecard) scorecard.textContent = String(currentScore)
}

export function moveSnek() {
  const newHead: Point = getNewTile(snek[0], direction)

  let didEat = false

  if (isHit(newHead, food)) {
    increaseScore()
    setFood()
    didEat = true
  }

  if (snek.some((snekTile) => isHit(snekTile, newHead))) {
    _isGameOver = true
    setIsRunning(false)
  }

  gameAreaElements[pointToIndex(snek[0])]?.classList.remove("head")
  gameAreaElements[pointToIndex(newHead)]?.classList.add("snek", "head")

  if (!didEat) {
    gameAreaElements[pointToIndex(snek.pop()!)].classList.remove("snek")
  }

  snek.unshift(newHead)
}

export function drawGameOver() {
  if (currentScore > highScore) {
    setHighscore(currentScore)
  }

  if (
    highScoresFromLS.length < 5 ||
    highScoresFromLS.some(({ score }) => score < currentScore)
  ) {
    highScoresFromLS.push({
      score: currentScore,
      time: new Date().toISOString(),
    })

    localStorage.setItem(HIGHSCORE_ID, JSON.stringify(highScoresFromLS))
  }

  alert("Game over!") // eslint-disable-line no-alert
}

export function setNewDirection(newDirection: Direction) {
  direction = newDirection
}

function getNewTile({ x, y }: Point, direction: Direction): Point {
  switch (direction) {
    case "up": {
      if (y === 0) return { x, y: gameAreaSize - 1 }
      return { x, y: y - 1 }
    }

    case "down": {
      if (y === gameAreaSize - 1) return { x, y: 0 }
      return { x, y: y + 1 }
    }

    case "left": {
      if (x === 0) return { x: gameAreaSize - 1, y }
      return { x: x - 1, y }
    }

    case "right": {
      if (x === gameAreaSize - 1) return { x: 0, y }
      return { x: x + 1, y }
    }
  }
}
