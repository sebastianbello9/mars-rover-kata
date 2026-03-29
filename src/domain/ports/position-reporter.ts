export interface PositionReporter {
  report(x: number, y: number, direction: "N" | "E" | "S" | "W"): void;
}
