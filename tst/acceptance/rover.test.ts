import { describe, expect, it } from "vitest";
import { Rover } from "#src/domain/rover.js";
import { RoverCommandService } from "#src/application/rover-command-service.js";
import { TerminalCommandInterpreter } from "#src/infrastructure/command-interpreter/terminal-command-interpreter.js";
import { Grid } from "#src/infrastructure/terrain/grid.js";

function buildRover(x: number, y: number, direction: "N" | "E" | "S" | "W", width = 10, height = 10) {
  const terrain = new Grid(width, height);
  const rover = new Rover(x, y, direction, terrain);
  const service = new RoverCommandService(rover);
  const interpreter = new TerminalCommandInterpreter(service);
  return { rover, interpreter };
}

describe("Rover acceptance", () => {
  describe("movement", () => {
    it("should move forward in the facing direction", () => {
      const { rover, interpreter } = buildRover(0, 0, "N");

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 1, direction: "N" });
    });

    it("should move backward opposite to the facing direction", () => {
      const { rover, interpreter } = buildRover(5, 5, "N");

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 5, y: 4, direction: "N" });
    });

    it("should execute a sequence of commands", () => {
      const { rover, interpreter } = buildRover(0, 0, "N");

      interpreter.execute("FFRFF");

      expect(rover.getPosition()).toEqual({ x: 2, y: 2, direction: "E" });
    });
  });

  describe("rotation", () => {
    it("should turn right", () => {
      const { rover, interpreter } = buildRover(0, 0, "N");

      interpreter.execute("R");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
    });

    it("should turn left", () => {
      const { rover, interpreter } = buildRover(0, 0, "N");

      interpreter.execute("L");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "W" });
    });

    it("should complete a full clockwise rotation", () => {
      const { rover, interpreter } = buildRover(0, 0, "N");

      interpreter.execute("RRRR");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
    });
  });

  describe("rebounding", () => {
    it("should rebound at the northern edge and face South", () => {
      const { rover, interpreter } = buildRover(0, 9, "N", 10, 10);

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 9, direction: "S" });
    });

    it("should rebound at the southern edge and face North", () => {
      const { rover, interpreter } = buildRover(0, 0, "S", 10, 10);

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
    });

    it("should rebound at the eastern edge and face West", () => {
      const { rover, interpreter } = buildRover(9, 0, "E", 10, 10);

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 9, y: 0, direction: "W" });
    });

    it("should rebound at the western edge and face East", () => {
      const { rover, interpreter } = buildRover(0, 0, "W", 10, 10);

      interpreter.execute("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
    });

    it("should rebound when moving backward past the southern edge", () => {
      const { rover, interpreter } = buildRover(0, 0, "N", 10, 10);

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "S" });
    });

    it("should rebound when moving backward past the northern edge", () => {
      const { rover, interpreter } = buildRover(0, 9, "S", 10, 10);

      interpreter.execute("B");

      expect(rover.getPosition()).toEqual({ x: 0, y: 9, direction: "N" });
    });
  });
});
