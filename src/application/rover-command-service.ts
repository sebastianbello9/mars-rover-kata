import { Rover } from "@src/domain/rover.js";
import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

export class RoverCommandService implements CommandInterpreter {
  constructor(private readonly rover: Rover) {}

  private readonly commands: Record<string, () => void> = {
    F: () => this.rover.move("F"),
    L: () => this.rover.turn("L"),
    R: () => this.rover.turn("R"),
  };

  interpret(command: string): void {
    this.commands[command]?.();
  }
}
