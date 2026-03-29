export interface CommandInterpreter {
  interpret(command: string): void;
  isKnown(command: string): boolean;
}
