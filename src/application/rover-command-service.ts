import { Rover } from "#src/domain/rover.js";
import type { CommandInterpreter } from "#src/domain/ports/command-interpreter.js";

export class RoverCommandService implements CommandInterpreter {
  constructor(private readonly rover: Rover) {}

  private readonly commands: Record<string, () => void> = {
    F: () => this.rover.move("F"),
    B: () => this.rover.move("B"),
    L: () => this.rover.turn("L"),
    R: () => this.rover.turn("R"),
  };

  isKnown(command: string): boolean {
    return command in this.commands;
  }

  interpret(command: string): void {
    this.commands[command]?.();
  }
}
