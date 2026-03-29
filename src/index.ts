import { Rover } from "#src/domain/rover.js";
import { RoverCommandService } from "#src/application/rover-command-service.js";
import { Grid } from "#src/infrastructure/terrain/grid.js";
import { TerminalCommandInterpreter } from "#src/infrastructure/command-interpreter/terminal-command-interpreter.js";
import { TerminalPositionReporter } from "#src/infrastructure/position-reporter/terminal-position-reporter.js";

const commandSequence = process.argv[2] ?? "";

const terrain = new Grid(10, 10);
const rover = new Rover(0, 0, "N", terrain);
const service = new RoverCommandService(rover);
const interpreter = new TerminalCommandInterpreter(service);
const reporter = new TerminalPositionReporter();

try {
  interpreter.execute(commandSequence);
  const { x, y, direction } = rover.getPosition();
  reporter.report(x, y, direction);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    process.exit(1);
  }
}
