import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

export class TerminalCommandInterpreter {
  constructor(private readonly commandInterpreter: CommandInterpreter) {}

  execute(commandSequence: string): void {
    for (const command of commandSequence) {
      this.commandInterpreter.interpret(command);
    }
  }
}
