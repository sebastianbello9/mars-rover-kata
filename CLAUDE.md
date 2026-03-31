# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn test              # Run tests in watch mode
yarn test:cov          # Run tests once with coverage report
yarn build             # Compile TypeScript to dist/
yarn start             # Run compiled output
```

To run a single test file:
```bash
yarn vitest run tst/domain/rover.test.ts
```

## Architecture

This project implements the Mars Rover Kata using **Hexagonal Architecture (Ports & Adapters)**:

- **`src/domain/`** — Pure business logic. The `Rover` entity owns position (`x`, `y`) and direction (`N`/`E`/`S`/`W`) state. No infrastructure dependencies.
- **`src/domain/obstacle-error.ts`** — Domain error thrown when the rover encounters an obstacle; carries the blocker's `x`/`y` coordinates.
- **`src/domain/ports/`** — Port interfaces:
  - `command-interpreter.ts` — Driving port (inbound); defines `interpret()` and `isKnown()`.
  - `terrain.ts` — Driven port; defines `hasObstacle()` and `rebound()`.
  - `position-reporter.ts` — Driven port; defines `report()`.
- **`src/application/`** — `RoverCommandService` implements `CommandInterpreter` and orchestrates the `Rover` entity. Only depends on the domain layer.
- **`src/infrastructure/command-interpreter/`** — `TerminalCommandInterpreter` is the driving adapter. It validates the full sequence for unknown commands before executing, then calls `CommandInterpreter.interpret()` per character.
- **`src/infrastructure/terrain/`** — `Grid` implements `Terrain`. Validates obstacles are within bounds on construction; `rebound()` clamps to grid edges and flips direction.
- **`src/infrastructure/position-reporter/`** — `TerminalPositionReporter` implements `PositionReporter`; prints `x:y:direction` to stdout.
- **`src/index.ts`** — Composition root. The only place that instantiates and wires all three layers together.
- **`tst/`** — Mirrors `src/` structure. Each layer is tested in isolation; acceptance tests in `tst/acceptance/` cover full end-to-end scenarios.

### Dependency rule

Infrastructure imports from `domain/ports` only. Application imports from `domain/` only. Neither infrastructure nor application may import from each other.

Import paths use the `@src/` alias (mapped to `src/`) and require the `.js` extension even for `.ts` files (Node.js ESM resolution).

## Domain Rules

Implemented commands:
- `F` — move forward one step (direction-aware; uses a `DELTAS` map keyed by `N`/`E`/`S`/`W`)
- `B` — move backward one step (same `DELTAS` map, step multiplied by `-1`)
- `L` / `R` — rotate 90° counter-clockwise / clockwise

Implemented behaviors:
- **Rebounding** — hitting a grid edge keeps the rover at the boundary and reverses its direction.
- **Obstacle detection** — when the target cell is occupied, movement halts and `ObstacleError` is thrown with the blocker's coordinates.

## References

- [Notion docs](https://www.notion.so/Mars-Rover-333ed7e47ac580c3bcf8cadfdb5f6fce) — full project documentation mirroring the README.

## Available Skills

Skills are located in `.agents/skills/` and provide reusable guidance for common tasks:

- **`architecture-patterns`** — Implement Clean Architecture, Hexagonal Architecture, and DDD patterns. Use when designing layers, debugging dependency cycles, or implementing aggregates and value objects.
- **`create-readme`** — Write comprehensive, well-structured README files following open source best practices.
- **`notion`** — Use the Notion API to create, read, and update pages, databases, and blocks. Use when syncing docs to the Notion workspace.
- **`github-actions-docs`** — Ground GitHub Actions answers in official docs. Use when writing, enhancing, or troubleshooting workflow YAML, triggers, runners, secrets, caching, artifacts, or security hardening.
