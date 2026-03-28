import { expect, it, vi } from "vitest";

it("should print a greting message", () => {
  const consoleLogSpy = vi.spyOn(console, "log");
  require("../src/index.ts");
  expect(consoleLogSpy).toHaveBeenCalledWith("Hello, World!");
});
