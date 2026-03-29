import { Rover } from "@src/domain/rover.js";
import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

export class RoverCommandService implements CommandInterpreter {
  constructor(private readonly rover: Rover) {}

  interpret(command: string): void {
    if (command === "F") {
      this.rover.move("F");
    }
  }
}
