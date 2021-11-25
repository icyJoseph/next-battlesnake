export function norm(x: number, y: number, width: number) {
  return x + y * width;
}

export function invNorm(normal: number, width: number) {
  return { x: normal % width, y: Math.floor(normal / width) };
}

export function createMatrix<T>(size: number, init: () => T): T[] {
  return Array.from({ length: size }, init);
}

export function create2dMatrix<T>(
  width: number,
  height: number,
  init: () => T
): T[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, init)
  );
}

export function flatten2dMatrix<T>(matrix: T[][]): T[] {
  const result: T[] = [];

  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    result.push(...row);
  }

  return result;
}

export function unflatten2dMatrix<T>(
  flatMatrix: T[],
  width: number,
  height: number
): T[][] {
  const result = [];

  for (let y = 0; y < height; y++) {
    const row = flatMatrix.slice(y * width, (y + 1) * width);
    result.push(row);
  }

  return result;
}

export function calcAdj(width: number, height: number) {
  const adj = createMatrix<number[]>(width * height, () => []);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = norm(x, y, width);
      if (x > 0) {
        // down
        adj[index].push(norm(x - 1, y, width));
      }
      if (y + 1 < height) {
        // right
        adj[index].push(norm(x, y + 1, width));
      }
      if (x + 1 < width) {
        // left
        adj[index].push(norm(x + 1, y, width));
      }
      if (y > 0) {
        // up
        adj[index].push(norm(x, y - 1, width));
      }
    }
  }

  return adj;
}

export function bfs(
  start: number,
  adj: number[][],
  grid: number[],
  size: number
) {
  const q: number[] = [];
  const visited = createMatrix(size, () => false);
  const distance = createMatrix(size, () => 0);

  visited[start] = true;
  distance[start] = 0;
  q.push(start);

  while (true) {
    const current = q.shift();

    if (current == null) break;

    for (const vec of adj[current]) {
      if (visited[vec]) continue;

      visited[vec] = true;

      if (grid[vec] === Infinity) {
        distance[vec] = Infinity;
        continue;
      }

      distance[vec] = distance[current] + 1;
      q.push(vec);
    }
  }

  return distance;
}

export function quick_bfs(
  start: number,
  target: number,
  adj: number[][],
  grid: number[],
  size: number
) {
  const q: number[] = [];
  const visited = createMatrix(size, () => false);
  const distance = createMatrix(size, () => Infinity);

  visited[start] = true;
  distance[start] = 0;
  q.push(start);

  while (true) {
    const current = q.shift();

    if (current == null) break;

    for (const vec of adj[current]) {
      if (vec === target) return distance[current] + 1;

      if (visited[vec]) continue;

      visited[vec] = true;

      if (grid[vec] === Infinity) {
        distance[vec] = Infinity;
        continue;
      }

      distance[vec] = distance[current] + 1;
      q.push(vec);
    }
  }
  return distance[target];
}
