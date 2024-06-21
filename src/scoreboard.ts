import { getScoreboardData, scoreboardLimit, writeHighscore } from "./firebase"
import { LOCALSTORAGE_NAME_ID, SCOREBOARD_SELECTOR } from "./ids"

let scoreboardData: Array<{ score: number; name: string; date: string }> = []

export function loadScoreboard() {
  getScoreboardData().then(
    (data) => {
      scoreboardData = data as Array<{
        score: number
        name: string
        date: string
      }>

      drawScoreboard()
    },
    (error) => {
      console.error("Failed to load scoreboard data", error)
    }
  )
}

export function getName() {
  return localStorage.getItem(LOCALSTORAGE_NAME_ID) ?? "Anon"
}

export function addHighScoreIfNeeded(score: number) {
  if (
    scoreboardData.length < scoreboardLimit ||
    scoreboardData.some(({ score: oldScore }) => oldScore < score)
  ) {
    writeHighscore({
      score,
      name: getName(),
      date: new Date().toISOString(),
    }).then(
      () => {
        loadScoreboard()
      },
      () => {
        console.error("Failed to write Score to Database")
      }
    )
  }
}

export function updateName(newName: string) {
  localStorage.setItem(LOCALSTORAGE_NAME_ID, newName)
}

function formatDate(date: Date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() % 100} ${date.getHours()}:${date.getMinutes()}`
}

function drawScoreboard() {
  const container = document.querySelector(SCOREBOARD_SELECTOR)

  if (!container) {
    console.error("failed to draw scoreboard")
    return
  }

  container.innerHTML = ""

  const list = document.createElement("ol")

  const nodes = scoreboardData.map(({ score, name, date }) => {
    const element = document.createElement("li")

    element.textContent = `${name}: ${score}         (${formatDate(new Date(date))})`

    return element
  })

  list.append(...nodes)
  container.append(list)
}
