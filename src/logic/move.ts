import type { GameState, Directions, MoveResponse } from "./types";

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
