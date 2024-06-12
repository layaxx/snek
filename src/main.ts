import { GAME_AREA_ID, SCORE_ID } from "./ids"
import { gameAreaSize, setupGameArea, setupSnek } from "./state"
import "./style.css"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>snek</h1>
    <h2>Score: <span id=${SCORE_ID}></span></h2>
    <div class="area" id="${GAME_AREA_ID}" style="grid-template-columns: repeat(${gameAreaSize}, 1fr)">
    </div>
  </div>
`

function init() {
  setupGameArea()
  setupEventHandlers()
  setupSnek()

  // startGame()
}

init()

function setupEventHandlers() {
  // throw new Error("Function not implemented.")
}
