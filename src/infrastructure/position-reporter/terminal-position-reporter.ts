import type { PositionReporter } from "@src/domain/ports/position-reporter.js";

export class TerminalPositionReporter implements PositionReporter {
  report(x: number, y: number, direction: "N" | "E" | "S" | "W"): void {
    console.log(`${x}:${y}:${direction}`);
  }
}
