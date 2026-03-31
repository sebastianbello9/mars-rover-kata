# Mars Rover Kata

> A TypeScript implementation of the Mars Rover Kata built with **Test-Driven Development** and **Hexagonal Architecture** (Ports & Adapters).

A squad of robotic rovers has been landed on a plateau on Mars. Each rover receives a sequence of commands to navigate a grid, rotating in cardinal directions and moving step by step — stopping if it encounters an obstacle.

> [!NOTE]
> See the [Notion documentation](https://www.notion.so/Mars-Rover-333ed7e47ac580c3bcf8cadfdb5f6fce) for the complete project specifications.

---

## Commands

| Command | Action                       |
| ------- | ---------------------------- |
| `F`     | Move forward one step        |
| `B`     | Move backward one step       |
| `L`     | Rotate 90° counter-clockwise |
| `R`     | Rotate 90° clockwise         |

Directions cycle as: `N` → `E` → `S` → `W` → `N` (rotating right).

> [!NOTE]
> Movement is direction-aware: `F`/`B` apply a delta based on the current facing direction (`N` → y+1, `S` → y−1, `E` → x+1, `W` → x−1). When the rover hits a grid edge it **rebounds**: it stays at the boundary and reverses direction. When it encounters an **obstacle**, the sequence halts and the blocker's position is reported.

---

## Getting Started

**Prerequisites:** Node.js >= 22, Yarn >= 1.22

```bash
yarn install
yarn build         # compile TypeScript to dist/
yarn start FFRFF   # run with a command sequence
```

The rover starts at `(0, 0)` facing `N` on a 10×10 grid. The final position is printed as `x:y:direction`.

---

## Architecture

The project follows **Hexagonal Architecture** — the domain core is fully isolated from infrastructure concerns. Dependencies always point inward.

```
src/
├── domain/
│   ├── rover.ts                                  # Rover entity — position and movement
│   ├── obstacle-error.ts                         # Domain error for obstacle detection
│   └── ports/
│       ├── command-interpreter.ts                # Driving port (inbound)
│       ├── terrain.ts                            # Driven port — grid/obstacle queries
│       └── position-reporter.ts                  # Driven port — position output
├── application/
│   └── rover-command-service.ts                  # Implements CommandInterpreter, orchestrates Rover
├── infrastructure/
│   ├── command-interpreter/
│   │   └── terminal-command-interpreter.ts       # Adapter — parses sequences, drives the port
│   ├── terrain/
│   │   └── grid.ts                               # Adapter — grid bounds and obstacle registry
│   └── position-reporter/
│       └── terminal-position-reporter.ts         # Adapter — prints position to stdout
└── index.ts                                      # Composition root — wires all layers
```

### Layer responsibilities

**Domain** — pure business logic with zero external dependencies. The `Rover` entity owns position (`x`, `y`) and direction (`N`/`E`/`S`/`W`) state. Ports are interfaces that define what the domain needs from the outside world (terrain) and what it exposes to drivers (command interpreter).

**Application** — `RoverCommandService` implements `CommandInterpreter` and is the only place that orchestrates domain logic. It depends on the domain layer only.

**Infrastructure** — three adapters plug into the ports:

- `TerminalCommandInterpreter` — validates a raw sequence (e.g. `"FFRFF"`), then calls `CommandInterpreter.interpret()` per character.
- `Grid` — implements `Terrain`; tracks obstacles and clamps positions to grid edges.
- `TerminalPositionReporter` — implements `PositionReporter`; prints `x:y:direction` to stdout.

**Composition root** — `src/index.ts` is the only place that knows about all three layers simultaneously.

### Dependency rule

```
TerminalCommandInterpreter
        │  depends on (interface only)
        ▼
CommandInterpreter  ◄──  RoverCommandService
     (port)                    │  depends on
                               ▼
                             Rover
                               │  depends on (interfaces only)
                    Terrain ◄──┤──► PositionReporter
                   (port)              (port)
                     ▲                   ▲
                    Grid    TerminalPositionReporter
```

> [!IMPORTANT]
> Infrastructure imports from `domain/ports` only — never from `application` or domain concretions. This makes every adapter swappable without touching the domain or application layers.

---

## Testing

Tests mirror the source structure and are kept layer-isolated. Domain tests never touch infrastructure; adapter tests run against mock ports; acceptance tests exercise the full wired system.

```bash
# Run tests in watch mode
yarn test

# Run tests once with coverage report
yarn test:cov

# Run a single test file
yarn vitest run tst/domain/rover.test.ts
```

| Test file                                                                     | What it covers                                                        |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `tst/domain/rover.test.ts`                                                    | `Rover` entity in isolation — movement, rotation, terrain interaction |
| `tst/application/rover-command-service.test.ts`                               | App service satisfies the `CommandInterpreter` port                   |
| `tst/infrastructure/command-interpreter/terminal-command-interpreter.test.ts` | Sequence parsing and unknown command validation                       |
| `tst/infrastructure/terrain/rectangular-grid.test.ts`                         | Grid obstacle registry and edge rebounding                            |
| `tst/acceptance/rover.test.ts`                                                | End-to-end scenarios against the fully wired system                   |

> [!TIP]
> Because the application service and adapters depend on interfaces, every unit test can use plain `vi.fn()` mocks — no real infrastructure required.

---

## Tech Stack

|            | Purpose                                           |
| ---------- | ------------------------------------------------- |
| TypeScript | Primary language, strict ESM (`"type": "module"`) |
| Vitest     | Test runner and coverage (`@vitest/coverage-v8`)  |
| Node.js    | Runtime with native ESM module resolution         |
