import type { Terrain } from "#src/domain/ports/terrain.js";

export class Grid implements Terrain {
  private readonly obstacles: Set<string>;

  constructor(
    private readonly width: number,
    private readonly height: number,
    obstacles: { x: number; y: number }[] = []
  ) {
    const invalid = obstacles.filter(({ x, y }) => x < 0 || x >= width || y < 0 || y >= height);
    if (invalid.length > 0) {
      throw new Error(`Obstacles out of bounds: ${invalid.map(({ x, y }) => `${x}:${y}`).join(", ")}`);
    }
    this.obstacles = new Set(obstacles.map(({ x, y }) => `${x}:${y}`));
  }

  hasObstacle(x: number, y: number): boolean {
    return this.obstacles.has(`${x}:${y}`);
  }

  private static readonly OPPOSITE = { N: "S", S: "N", E: "W", W: "E" } as const;

  rebound(x: number, y: number, direction: "N" | "E" | "S" | "W") {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return { x, y, direction };
    }
    return {
      x: Math.max(0, Math.min(x, this.width - 1)),
      y: Math.max(0, Math.min(y, this.height - 1)),
      direction: Grid.OPPOSITE[direction],
    };
  }
}
