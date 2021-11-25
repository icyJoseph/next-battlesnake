import type { GameState, Directions, MoveResponse } from "./types";
import {
  bfs,
  calcAdj,
  norm,
  invNorm,
  createMatrix,
  quick_bfs
} from "helpers/bfs";
import { Dir } from "fs";

type Moves = Record<Directions, number>;

const directions: Directions[] = ["up", "down", "right", "left"];
const isKey = (key: any): key is Directions =>
  Boolean(directions.find((x) => x === key));

export function move(gameState: GameState): MoveResponse {
  let possibleMoves: Moves = {
    up: Infinity,
    down: Infinity,
    left: Infinity,
    right: Infinity
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

  const [tail] = myBody.slice(-1);

  for (const val of headAdj) {
    const { x: x0, y: y0 } = invNorm(val, boardWidth);
    if (selfLength <= 15) {
      if (adj[val].filter((val) => distances[val] !== Infinity).length <= 1)
        continue;
    }

    const distance2tail = quick_bfs(
      val,
      norm(tail.x, tail.y, boardWidth),
      adj,
      boardMatrix,
      boardHeight * boardWidth
    );

    if (distance2tail === Infinity) continue;

    if (myHead.x === x0) {
      // on the same X axis
      if (myHead.y + 1 === y0) {
        // moving down but it is inverted
        possibleMoves.up = adj[val].filter(
          (val) => distances[val] !== Infinity
        ).length;
      } else {
        // moving up but it is inverted
        possibleMoves.down = adj[val].filter(
          (val) => distances[val] !== Infinity
        ).length;
      }
    }

    if (myHead.y === y0) {
      // on the same Y axis
      if (myHead.x + 1 === x0) {
        // moving to the right
        possibleMoves.right = adj[val].filter(
          (val) => distances[val] !== Infinity
        ).length;
      } else {
        // moving to the left
        possibleMoves.left = adj[val].filter(
          (val) => distances[val] !== Infinity
        ).length;
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

  const absoluteBest = Math.max(
    ...Object.values(possibleMoves).filter((val) => val !== Infinity)
  );

  const bestMoves: Directions[] = Object.entries(possibleMoves)
    .filter(([, value]) => value !== Infinity) // remove impossible
    .sort((a, b) => b[1] - a[1]) // sort ascending
    .filter(([, value]) => value < absoluteBest) // keep the best
    .map(([key]) => key) // take only the move name
    .filter(isKey); // keep TS happy

  if (bestMoves.length === 0) {
    // HALT AND CATCH FIRE
    const response: MoveResponse = {
      move: "up"
    };

    console.log(
      `HALT: ${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`
    );
    return response;
  }

  // keep it classy with a random choice
  const response: MoveResponse = {
    move: bestMoves[Math.floor(Math.random() * bestMoves.length)]
  };

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`);
  return response;
}
