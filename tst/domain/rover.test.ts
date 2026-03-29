import { describe, expect, it } from "vitest";
import { Rover } from "@src/domain/rover.js";

describe("Rover", () => {
  it("should move forward when facing North", () => {
    const rover = new Rover(0, 0, "N");

    rover.move("F");

    expect(rover.getPosition()).toEqual({ x: 0, y: 1, direction: "N" });
  });

  it("should turn right when facing North", () => {
    const rover = new Rover(0, 0, "N");

    rover.turn("R");

    expect(rover.getPosition()).toEqual({ x: 0, y: 0, direction: "E" });
  });
});
