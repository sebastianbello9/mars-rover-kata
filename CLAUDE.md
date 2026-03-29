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
- **`src/domain/ports/`** — Driving ports (inbound interfaces). `CommandInterpreter` lives here — not in infrastructure.
- **`src/application/`** — `RoverCommandService` implements `CommandInterpreter` and orchestrates the `Rover` entity. Only depends on the domain layer.
- **`src/infrastructure/command-interpreter/`** — `TerminalCommandInterpreter` is the driving adapter. It accepts a raw sequence string (e.g. `"FFL"`), iterates each character, and calls `CommandInterpreter.interpret()` per command. Depends on the port interface only — never on domain concretions.
- **`src/index.ts`** — Composition root. The only place that instantiates and wires all three layers together.
- **`tst/`** — Mirrors `src/` structure. Each layer is tested in isolation (domain tests have no infrastructure imports; adapter tests use `vi.fn()` mocks).

### Dependency rule

Infrastructure imports from `domain/ports` only. Application imports from `domain/` only. Neither infrastructure nor application may import from each other.

Import paths use the `@src/` alias (mapped to `src/`) and require the `.js` extension even for `.ts` files (Node.js ESM resolution).

## Domain Rules

Implemented commands:
- `F` — move forward one step (direction-aware movement not yet implemented; currently always increments `y`)
- `L` / `R` — rotate 90° counter-clockwise / clockwise

Planned (not yet implemented):
- `B` — move backward one step
- Toroidal wrapping — grid edges wrap around (e.g., moving past the top returns at the bottom)
- Obstacle detection — halt the sequence and report the blocker's position

## Available Skills

Skills are located in `.agents/skills/` and provide reusable guidance for common tasks:

- **`architecture-patterns`** — Implement Clean Architecture, Hexagonal Architecture, and DDD patterns. Use when designing layers, debugging dependency cycles, or implementing aggregates and value objects.
- **`create-readme`** — Write comprehensive, well-structured README files following open source best practices.
