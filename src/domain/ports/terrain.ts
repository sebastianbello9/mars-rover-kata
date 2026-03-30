export interface Terrain {
  hasObstacle(x: number, y: number): boolean;
  rebound(
    x: number,
    y: number,
    direction: "N" | "E" | "S" | "W"
  ): { x: number; y: number; direction: "N" | "E" | "S" | "W" };
}
