import { describe, expect, it } from "vitest";
import { Grid } from "@src/infrastructure/terrain/grid.js";

describe("Grid", () => {
  it("should return position and direction unchanged when within bounds", () => {
    const grid = new Grid(10, 10);

    expect(grid.rebound(0, 0, "N")).toEqual({ x: 0, y: 0, direction: "N" });
    expect(grid.rebound(9, 9, "E")).toEqual({ x: 9, y: 9, direction: "E" });
    expect(grid.rebound(5, 5, "S")).toEqual({ x: 5, y: 5, direction: "S" });
  });

  it("should clamp to the northern edge and flip direction when y exceeds the grid", () => {
    const grid = new Grid(10, 10);

    expect(grid.rebound(5, 10, "N")).toEqual({ x: 5, y: 9, direction: "S" });
  });

  it("should clamp to the southern edge and flip direction when y goes below zero", () => {
    const grid = new Grid(10, 10);

    expect(grid.rebound(5, -1, "S")).toEqual({ x: 5, y: 0, direction: "N" });
  });

  it("should clamp to the eastern edge and flip direction when x exceeds the grid", () => {
    const grid = new Grid(10, 10);

    expect(grid.rebound(10, 5, "E")).toEqual({ x: 9, y: 5, direction: "W" });
  });

  it("should clamp to the western edge and flip direction when x goes below zero", () => {
    const grid = new Grid(10, 10);

    expect(grid.rebound(-1, 5, "W")).toEqual({ x: 0, y: 5, direction: "E" });
  });
});
