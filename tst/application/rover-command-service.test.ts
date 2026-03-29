import { describe, expect, it } from "vitest";
import { Rover } from "@src/domain/rover.js";
import { RoverCommandService } from "@src/application/rover-command-service.js";
import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

describe("RoverCommandService", () => {
  it("should satisfy the CommandInterpreter port", () => {
    const rover = new Rover(0, 0, "N");
    const service: CommandInterpreter = new RoverCommandService(rover);

    service.interpret("F");

    expect(rover.getPosition()).toEqual({ x: 0, y: 1, direction: "N" });
  });

  it("should do nothing for an unrecognized command", () => {
    const rover = new Rover(0, 0, "N");
    const service: CommandInterpreter = new RoverCommandService(rover);

    service.interpret("X");

    expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });
  });

  it("should turn left and right correctly", () => {
    const rover = new Rover(0, 0, "N");
    const service: CommandInterpreter = new RoverCommandService(rover);

    service.interpret("L");
    expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "W" });

    service.interpret("R");
    expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "N" });

    service.interpret("R");
    expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
  });

  it("should move backward correctly", () => {
    const rover = new Rover(0, 0, "N");
    const service: CommandInterpreter = new RoverCommandService(rover);

    service.interpret("B");
    expect(rover.getPosition()).toEqual({ x: 0, y: -1, direction: "N" });
  });

  describe("isKnown", () => {
    it("should return true for all valid commands", () => {
      const service = new RoverCommandService(new Rover(0, 0, "N"));

      expect(service.isKnown("F")).toBe(true);
      expect(service.isKnown("B")).toBe(true);
      expect(service.isKnown("L")).toBe(true);
      expect(service.isKnown("R")).toBe(true);
    });

    it("should return false for unknown commands", () => {
      const service = new RoverCommandService(new Rover(0, 0, "N"));

      expect(service.isKnown("X")).toBe(false);
      expect(service.isKnown("")).toBe(false);
      expect(service.isKnown(" ")).toBe(false);
    });
  });
});
