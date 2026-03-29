export class Rover {
  private x: number;
  private y: number;
  private direction: "N" | "E" | "S" | "W";

  constructor(x: number, y: number, direction: "N" | "E" | "S" | "W") {
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
    this.x += dx * step;
    this.y += dy * step;
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
