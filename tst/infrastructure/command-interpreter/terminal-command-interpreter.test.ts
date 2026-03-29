import { describe, expect, it, vi } from "vitest";
import { TerminalCommandInterpreter } from "@src/infrastructure/command-interpreter/terminal-command-interpreter.js";
import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

function mockInterpreter(known = true): CommandInterpreter {
  return {
    interpret: vi.fn(),
    isKnown: vi.fn().mockReturnValue(known),
  };
}

describe("TerminalCommandInterpreter", () => {
  it("should call interpret once for a single command", () => {
    const interpreter = mockInterpreter();
    const adapter = new TerminalCommandInterpreter(interpreter);

    adapter.execute("F");

    expect(interpreter.interpret).toHaveBeenCalledOnce();
    expect(interpreter.interpret).toHaveBeenCalledWith("F");
  });

  it("should call interpret for each command in a sequence", () => {
    const interpreter = mockInterpreter();
    const adapter = new TerminalCommandInterpreter(interpreter);

    adapter.execute("FFL");

    expect(interpreter.interpret).toHaveBeenCalledTimes(3);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, "F");
    expect(interpreter.interpret).toHaveBeenNthCalledWith(2, "F");
    expect(interpreter.interpret).toHaveBeenNthCalledWith(3, "L");
  });

  it("should not call interpret for an empty sequence", () => {
    const interpreter = mockInterpreter();
    const adapter = new TerminalCommandInterpreter(interpreter);

    adapter.execute("");

    expect(interpreter.interpret).not.toHaveBeenCalled();
  });

  describe("validation", () => {
    it("should throw when the sequence contains an unknown command", () => {
      const interpreter: CommandInterpreter = {
        interpret: vi.fn(),
        isKnown: vi.fn().mockImplementation((cmd) => cmd !== "X"),
      };
      const adapter = new TerminalCommandInterpreter(interpreter);

      expect(() => adapter.execute("FXF")).toThrow(
        'Unknown command(s) in sequence "FXF": X (position 2)'
      );
    });

    it("should report all unknown commands at once", () => {
      const interpreter: CommandInterpreter = {
        interpret: vi.fn(),
        isKnown: vi.fn().mockImplementation((cmd) => cmd === "F"),
      };
      const adapter = new TerminalCommandInterpreter(interpreter);

      expect(() => adapter.execute("FXBQF")).toThrow(
        'Unknown command(s) in sequence "FXBQF": X (position 2), B (position 3), Q (position 4)'
      );
    });

    it("should not call interpret when the sequence contains unknown commands", () => {
      const interpreter: CommandInterpreter = {
        interpret: vi.fn(),
        isKnown: vi.fn().mockImplementation((cmd) => cmd !== "X"),
      };
      const adapter = new TerminalCommandInterpreter(interpreter);

      expect(() => adapter.execute("FXF")).toThrow();
      expect(interpreter.interpret).not.toHaveBeenCalled();
    });
  });
});
