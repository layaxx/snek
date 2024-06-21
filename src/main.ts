import { setupEventHandlers } from "./event-handlers"
import {
  GAME_AREA_ID,
  HIGHSCORE_ID,
  NAME_INPUT_ID,
  NAME_INPUT_SELECTOR,
  PAUSE_BUTTON_ID,
  SCOREBOARD_ID,
  SCORE_ID,
  SPEED_DISPLAY_ID,
} from "./ids"
import { getName, loadScoreboard } from "./scoreboard"
import {
  defaultSpeed,
  gameAreaSize,
  setupGameArea,
  setupHighscore,
  setupSnek,
} from "./state"
import "./style.css"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>snek</h1>
    <h2>Score: <span id="${SCORE_ID}">0</span>, Highscore: <span id="${HIGHSCORE_ID}">0</span></h2>
    <button id="${PAUSE_BUTTON_ID}">Start</button>
    <div class="flex">
      <div class="area" id="${GAME_AREA_ID}" style="grid-template-columns: repeat(${gameAreaSize}, 1fr)"></div>

      <div>
      <p>
        slow
        <input type="range" min="10" max="200" value="${defaultSpeed}" class="slider" id="speed-selector">
        fast
        <br />
        <span id="${SPEED_DISPLAY_ID}">${defaultSpeed}</span>
      </p>

      <div>
        <h2>Scoreboard</h2>
        <label>Name: <input type="text" id=${NAME_INPUT_ID}></input></label>
        <div id="${SCOREBOARD_ID}"></div>
      </div>
    </div>
  </div>
`

function init() {
  setupHighscore()
  setupGameArea()
  setupSnek()
  setupEventHandlers()

  loadScoreboard()

  const nameInput =
    document.querySelector<HTMLInputElement>(NAME_INPUT_SELECTOR)

  if (nameInput) nameInput.value = getName()
}

init()
