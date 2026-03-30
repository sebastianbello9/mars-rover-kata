export class ObstacleError extends Error {
  constructor(public readonly x: number, public readonly y: number) {
    super(`Obstacle detected at ${x}:${y}`);
    this.name = "ObstacleError";
  }
}
