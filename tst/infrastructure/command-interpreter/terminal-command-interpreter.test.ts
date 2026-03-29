import { describe, expect, it, vi } from "vitest";
import { TerminalCommandInterpreter } from "@src/infrastructure/command-interpreter/terminal-command-interpreter.js";
import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

describe("TerminalCommandInterpreter", () => {
  it("should call interpret once for a single command", () => {
    const mockInterpreter: CommandInterpreter = { interpret: vi.fn() };
    const adapter = new TerminalCommandInterpreter(mockInterpreter);

    adapter.execute("F");

    expect(mockInterpreter.interpret).toHaveBeenCalledOnce();
    expect(mockInterpreter.interpret).toHaveBeenCalledWith("F");
  });

  it("should call interpret for each command in a sequence", () => {
    const mockInterpreter: CommandInterpreter = { interpret: vi.fn() };
    const adapter = new TerminalCommandInterpreter(mockInterpreter);

    adapter.execute("FFL");

    expect(mockInterpreter.interpret).toHaveBeenCalledTimes(3);
    expect(mockInterpreter.interpret).toHaveBeenNthCalledWith(1, "F");
    expect(mockInterpreter.interpret).toHaveBeenNthCalledWith(2, "F");
    expect(mockInterpreter.interpret).toHaveBeenNthCalledWith(3, "L");
  });

  it("should not call interpret for an empty sequence", () => {
    const mockInterpreter: CommandInterpreter = { interpret: vi.fn() };
    const adapter = new TerminalCommandInterpreter(mockInterpreter);

    adapter.execute("");

    expect(mockInterpreter.interpret).not.toHaveBeenCalled();
  });
});
