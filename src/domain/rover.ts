import type { Terrain } from "#src/domain/ports/terrain.js";
import { ObstacleError } from "#src/domain/obstacle-error.js";

export class Rover {
  private x: number;
  private y: number;
  private direction: "N" | "E" | "S" | "W";

  constructor(
    x: number,
    y: number,
    direction: "N" | "E" | "S" | "W",
    private readonly terrain?: Terrain
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  private static readonly DELTAS: Record<"N" | "E" | "S" | "W", { dx: number; dy: number }> = {
    N: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 },
  };

  move(command: "F" | "B") {
    const step = command === "F" ? 1 : -1;
    const { dx, dy } = Rover.DELTAS[this.direction];
    const newX = this.x + dx * step;
    const newY = this.y + dy * step;

    if (this.terrain) {
      if (this.terrain.hasObstacle(newX, newY)) {
        throw new ObstacleError(newX, newY);
      }
      const result = this.terrain.rebound(newX, newY, this.direction);
      this.x = result.x;
      this.y = result.y;
      this.direction = result.direction;
    } else {
      this.x = newX;
      this.y = newY;
    }
  }

  turn(command: "L" | "R") {
    const clockwise: ("N" | "E" | "S" | "W")[] = ["N", "E", "S", "W"];
    const step = command === "R" ? 1 : -1;
    const currentIndex = clockwise.indexOf(this.direction);
    this.direction = clockwise[(currentIndex + step + 4) % 4];
  }

  getPosition() {
    return { x: this.x, y: this.y, direction: this.direction };
  }
}
