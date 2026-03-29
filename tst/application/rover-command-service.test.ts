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
});
