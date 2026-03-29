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

  getPosition() {
    return { x: this.x, y: this.y, direction: this.direction };
  }
}
