export interface CommandInterpreter {
  interpret(command: string): void;
}
