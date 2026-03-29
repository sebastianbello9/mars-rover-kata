export interface Terrain {
  rebound(
    x: number,
    y: number,
    direction: "N" | "E" | "S" | "W"
  ): { x: number; y: number; direction: "N" | "E" | "S" | "W" };
}
