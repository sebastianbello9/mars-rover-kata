import type { CommandInterpreter } from "@src/domain/ports/command-interpreter.js";

export class TerminalCommandInterpreter {
  constructor(private readonly commandInterpreter: CommandInterpreter) {}

  execute(commandSequence: string): void {
    const unknown = [...commandSequence]
      .map((cmd, i) => ({ cmd, pos: i + 1 }))
      .filter(({ cmd }) => !this.commandInterpreter.isKnown(cmd));

    if (unknown.length > 0) {
      const details = unknown.map(({ cmd, pos }) => `${cmd} (position ${pos})`).join(", ");
      throw new Error(`Unknown command(s) in sequence "${commandSequence}": ${details}`);
    }

    for (const command of commandSequence) {
      this.commandInterpreter.interpret(command);
    }
  }
}
