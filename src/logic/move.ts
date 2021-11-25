import type { GameState, Directions, MoveResponse } from "./types";
import { bfs, calcAdj, norm, invNorm, createMatrix } from "helpers/bfs";

type Moves = Record<Directions, boolean>;

const isKey = (key: any, moves: Moves): key is Directions => key in moves;

export function move(gameState: GameState): MoveResponse {
  let possibleMoves: Moves = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  const { board, you } = gameState;

  // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
  const boardWidth = board.width;
  const boardHeight = board.height;
  const snakes = board.snakes;

  const boardMatrix = createMatrix<number>(boardWidth * boardHeight, () => 0);
  const adj = calcAdj(boardWidth, boardHeight);

  for (const snake of snakes) {
    const { body, head } = snake;
    for (const coord of body) {
      const { x, y } = coord;
      // it means that these should be impossible to reach
      // because it'd mean dying, there's no distance that could take
      // our snake here
      boardMatrix[norm(x, y, boardWidth)] = Infinity;
    }
  }

  // Self information

  const { health, length: selfLength, head: myHead, body: myBody } = you;

  const distances = bfs(
    norm(myHead.x, myHead.y, boardWidth),
    adj,
    boardMatrix,
    boardHeight * boardWidth
  );

  // get all adjacent to head that are possible
  const headAdj = adj[norm(myHead.x, myHead.y, boardWidth)].filter(
    (val) => distances[val] !== Infinity
  );

  for (const val of headAdj) {
    const { x: x0, y: y0 } = invNorm(val, boardWidth);

    if (myHead.x === x0) {
      // on the same X axis
      if (myHead.y + 1 === y0) {
        // moving down but it is inverted
        possibleMoves.up = true;
      } else {
        // moving up but it is inverted
        possibleMoves.down = true;
      }
    }

    if (myHead.y === y0) {
      // on the same Y axis
      if (myHead.x + 1 === x0) {
        // moving to the right
        possibleMoves.right = true;
      } else {
        // moving to the left
        possibleMoves.left = true;
      }
    }
  }

  // if (selfLength < 10) {
  //   // look for closest food
  // } else {
  //   if (health < 10) {
  //     // look for closest food
  //   } else {
  //     // chase tail
  //     // move to adj to tail which has least distance
  //   }
  // }

  // TODO: Step 1 - Don't hit walls.

  // TODO: Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
  const safeMoves = Object.keys(possibleMoves).filter(
    (key): key is keyof Moves => isKey(key, possibleMoves) && possibleMoves[key]
  );

  const response: MoveResponse = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)] || "up"
  };

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`);
  return response;
}
