import { describe, expect, it, vi } from "vitest";
import { Rover } from "#src/domain/rover.js";
import type { Terrain } from "#src/domain/ports/terrain.js";

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

  it("should move backward when facing South", () => {
    const rover = new Rover(0, 0, "S");

    rover.move("B");

    expect(rover.getPosition()).toEqual({ x: 0, y: 1, direction: "S" });
  });

  describe("with terrain", () => {
    it("should use the position and direction returned by terrain.rebound", () => {
      const terrain: Terrain = { rebound: vi.fn().mockReturnValue({ x: 0, y: 9, direction: "S" }) };
      const rover = new Rover(0, 0, "N", terrain);

      rover.move("F");

      expect(rover.getPosition()).toEqual({ x: 0, y: 9, direction: "S" });
    });

    it("should pass the next position and current direction to terrain.rebound", () => {
      const terrain: Terrain = { rebound: vi.fn().mockReturnValue({ x: 0, y: 1, direction: "N" }) };
      const rover = new Rover(0, 0, "N", terrain);

      rover.move("F");

      expect(terrain.rebound).toHaveBeenCalledWith(0, 1, "N");
    });
  });
});
