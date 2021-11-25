export function norm(x: number, y: number, width: number) {
  return x + y * width;
}

export function inv_norm(normal: number, width: number) {
  return [normal % width, normal / width];
}

export function calc_adj(height: number, width: number) {
  const adj: number[][] = Array.from({ length: width * height }, () => []);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = norm(x, y, width);
      if (x > 0) {
        adj[index].push(norm(x - 1, y, width));
      }
      if (y + 1 < height) {
        adj[index].push(norm(x, y + 1, width));
      }
      if (x + 1 < width) {
        adj[index].push(norm(x + 1, y, width));
      }
      if (y > 0) {
        adj[index].push(norm(x, y - 1, width));
      }
    }
  }

  return adj;
}

export function bfs(start: number, adj: number[][], N: number) {
  const q: number[] = [];
  const visited = Array.from({ length: N }, () => false);
  const distance = Array.from({ length: N }, () => 0);

  visited[start] = true;
  distance[start] = 0;
  q.push(start);

  while (true) {
    const current = q.shift();

    if (current == null) break;

    for (const vec of adj[current]) {
      if (visited[vec]) continue;

      visited[vec] = true;
      distance[vec] = distance[current] + 1;
      q.push(vec);
    }
  }

  return distance;
}

export function print_matrix(
  matrix: number[][],
  width: number,
  height: number
) {
  const result = [];

  for (let y = 0; y < height; y++) {
    const row = matrix.slice(y * width, (y + 1) * width);
    result.push(row);
  }

  return result;
}
