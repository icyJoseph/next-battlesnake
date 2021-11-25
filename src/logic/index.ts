import type { GameState } from "./types";

export { move } from "./move";
export { info } from "./info";

export function start(gameState: GameState): void {
  console.log(`${gameState.game.id} START`);
}

export function end(gameState: GameState): void {
  console.log(`${gameState.game.id} END\n`);
}
