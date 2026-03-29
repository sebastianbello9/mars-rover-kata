import { afterEach, beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("should print the final rover position after executing commands from argv", async () => {
  process.argv[2] = "FFRFF";

  await import("#src/index.js");

  expect(console.log).toHaveBeenCalledWith("2:2:E");
});

it("should use an empty command sequence when no argv is provided", async () => {
  process.argv[2] = undefined as unknown as string;

  await import("#src/index.js");

  expect(console.log).toHaveBeenCalledWith("0:0:N");
});

it("should silently catch non-Error throws", async () => {
  vi.doMock("#src/infrastructure/command-interpreter/terminal-command-interpreter.js", () => ({
    TerminalCommandInterpreter: class {
      execute() {
        throw "not an error";
      }
    },
  }));

  process.argv[2] = "F";

  await import("#src/index.js");

  vi.doUnmock("#src/infrastructure/command-interpreter/terminal-command-interpreter.js");

  expect(console.error).not.toHaveBeenCalled();
  expect(process.exit).not.toHaveBeenCalled();
});

it("should print an error and exit with code 1 for unknown commands", async () => {
  process.argv[2] = "FFXF";

  await import("#src/index.js");

  expect(console.error).toHaveBeenCalledWith(
    'Unknown command(s) in sequence "FFXF": X (position 3)'
  );
  expect(process.exit).toHaveBeenCalledWith(1);
});
