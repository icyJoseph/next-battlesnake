export interface InfoResponse {
  apiversion: string;
  author?: string;
  color?: string;
  head?: string;
  tail?: string;
  version?: string;
}

export interface MoveResponse {
  move: string;
  shout?: string;
}

export interface RoyaleSettings {
  shrinkEveryNTurns: number;
}

export interface SquadSettings {
  allowBodyCollisions: boolean;
  sharedElimination: boolean;
  sharedHealth: boolean;
  sharedLength: boolean;
}

export interface RulesetSettings {
  foodSpawnChance: number;
  minimumFood: number;
  hazardDamagePerTurn: number;
  royale: RoyaleSettings;
  squad: SquadSettings;
}

export interface Ruleset {
  name: string;
  version: string;
  settings: RulesetSettings;
}

export interface Game {
  id: string;
  ruleset: Ruleset;
  timeout: number;
  source: string;
}

export interface Coord {
  x: number;
  y: number;
}

export interface Battlesnake {
  id: string;
  name: string;
  health: number;
  body: Coord[];
  latency: string;
  head: Coord;
  length: number;

  // Used in non-standard game modes
  shout: string;
  squad: string;
}

export interface Board {
  height: number;
  width: number;
  food: Coord[];
  snakes: Battlesnake[];

  // Used in non-standard game modes
  hazards: Coord[];
}

export interface GameState {
  game: Game;
  turn: number;
  board: Board;
  you: Battlesnake;
}

export function info(): InfoResponse {
  console.log("INFO");

  const response: InfoResponse = {
    apiversion: "1",
    author: "icyJoseph",
    color: "#212738",
    head: "default",
    tail: "default"
  };

  return response;
}

export function start(gameState: GameState): void {
  console.log(`${gameState.game.id} START`);
}

export function end(gameState: GameState): void {
  console.log(`${gameState.game.id} END\n`);
}

export type Directions = "up" | "down" | "left" | "right";

type Moves = Record<Directions, boolean>;

export function move(gameState: GameState): MoveResponse {
  let possibleMoves: Moves = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // Step 0: Don't let your Battlesnake move back on it's own neck
  const myHead = gameState.you.head;
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    possibleMoves.left = false;
  } else if (myNeck.x > myHead.x) {
    possibleMoves.right = false;
  } else if (myNeck.y < myHead.y) {
    possibleMoves.down = false;
  } else if (myNeck.y > myHead.y) {
    possibleMoves.up = false;
  }

  // TODO: Step 1 - Don't hit walls.
  // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // if at the top edge
  if (myHead.y === boardHeight - 1) {
    possibleMoves.up = false;
  }
  // if at the bottom edge
  if (myHead.y === 0) {
    possibleMoves.down = false;
  }

  // if at the left edge
  if (myHead.x === 0) {
    possibleMoves.left = false;
  }

  // if at the right edge
  if (myHead.x === boardWidth - 1) {
    possibleMoves.right = false;
  }

  // TODO: Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.
  const mybody = gameState.you.body;

  if (mybody.find(({ x, y }) => x === myHead.x && y === myHead.y + 1)) {
    possibleMoves.up = false;
  }

  if (mybody.find(({ x, y }) => x === myHead.x && y === myHead.y - 1)) {
    possibleMoves.down = false;
  }

  if (mybody.find(({ x, y }) => x === myHead.x - 1 && y === myHead.y)) {
    possibleMoves.left = false;
  }

  if (mybody.find(({ x, y }) => x === myHead.x + 1 && y === myHead.y)) {
    possibleMoves.right = false;
  }

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
  const safeMoves = Object.keys(possibleMoves).filter(
    (key) => possibleMoves[key as keyof Moves]
  );
  const response: MoveResponse = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)] || "up"
  };

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`);
  return response;
}
