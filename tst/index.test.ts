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

  await import("@src/index.js");

  expect(console.log).toHaveBeenCalledWith("2:2:E");
});

it("should print an error and exit with code 1 for unknown commands", async () => {
  process.argv[2] = "FFXF";

  await import("@src/index.js");

  expect(console.error).toHaveBeenCalledWith(
    'Unknown command(s) in sequence "FFXF": X (position 3)'
  );
  expect(process.exit).toHaveBeenCalledWith(1);
});
