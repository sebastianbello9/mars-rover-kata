export class Rover {
  private x: number;
  private y: number;
  private direction: "N" | "E" | "S" | "W";

  constructor(x: number, y: number, direction: "N" | "E" | "S" | "W") {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  move(command: "F") {
    this.y += 1;
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
