import { describe, expect, it } from "vitest";
import { Rover } from "#src/domain/rover.js";
import { ObstacleError } from "#src/domain/obstacle-error.js";
import { RoverCommandService } from "#src/application/rover-command-service.js";
import { TerminalCommandInterpreter } from "#src/infrastructure/command-interpreter/terminal-command-interpreter.js";
import { Grid } from "#src/infrastructure/terrain/grid.js";

type Direction = "N" | "E" | "S" | "W";

function buildRover({
  x = 0,
  y = 0,
  direction = "N" as Direction,
  width = 10,
  height = 10,
  obstacles = [] as { x: number; y: number }[],
} = {}) {
  const terrain = new Grid(width, height, obstacles);
  const rover = new Rover(x, y, direction, terrain);
  const service = new RoverCommandService(rover);
  const interpreter = new TerminalCommandInterpreter(service);
  return { rover, interpreter };
}

describe("Rover acceptance", () => {
  describe("movement", () => {
    it("should move forward in the facing direction", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 1, direction: "N" });
    });

    it("should move backward opposite to the facing direction", () => {
      const { rover, interpreter } = buildRover({ x: 5, y: 5, direction: "N" });

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 5, y: 4, direction: "N" });
    });

    it("should execute a sequence of commands", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("FFRFF");

      expect(rover.getPosition()).toEqual({ x: 2, y: 2, direction: "E" });
    });
  });

  describe("rotation", () => {
    it("should turn right", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("R");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
    });

    it("should turn left", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("L");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "W" });
    });

    it("should complete a full clockwise rotation", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("RRRR");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
    });
  });

  describe("rebounding", () => {
    it("should rebound at the northern edge and face South", () => {
      const { rover, interpreter } = buildRover({ y: 9, direction: "N" });

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 9, direction: "S" });
    });

    it("should rebound at the southern edge and face North", () => {
      const { rover, interpreter } = buildRover({ direction: "S" });

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
    });

    it("should rebound at the eastern edge and face West", () => {
      const { rover, interpreter } = buildRover({ x: 9, direction: "E" });

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 9, y: 0, direction: "W" });
    });

    it("should rebound at the western edge and face East", () => {
      const { rover, interpreter } = buildRover({ direction: "W" });

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
    });

    it("should rebound when moving backward past the southern edge", () => {
      const { rover, interpreter } = buildRover({ direction: "N" });

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "S" });
    });

    it("should rebound when moving backward past the northern edge", () => {
      const { rover, interpreter } = buildRover({ y: 9, direction: "S" });

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 0, y: 9, direction: "N" });
    });
  });

  describe("obstacle detection", () => {
    it("should throw ObstacleError when the next position has an obstacle", () => {
      const { interpreter } = buildRover({ obstacles: [{ x: 0, y: 1 }] });

      expect(() => interpreter.execute("F")).toThrow(ObstacleError);
    });

    it("should report the obstacle position in the error message", () => {
      const { interpreter } = buildRover({ obstacles: [{ x: 0, y: 1 }] });

      expect(() => interpreter.execute("F")).toThrow("Obstacle detected at 0:1");
    });

    it("should keep the rover at its last valid position before the obstacle", () => {
      const { rover, interpreter } = buildRover({ obstacles: [{ x: 0, y: 3 }] });

      expect(() => interpreter.execute("FFFF")).toThrow(ObstacleError);

      expect(rover.getPosition()).toEqual({ x: 0, y: 2, direction: "N" });
    });

    it("should not execute commands after an obstacle is hit", () => {
      const { rover, interpreter } = buildRover({ obstacles: [{ x: 0, y: 1 }] });

      expect(() => interpreter.execute("FRF")).toThrow(ObstacleError);

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
    });
  });
});
