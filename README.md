# Mars Rover Kata

> A TypeScript implementation of the Mars Rover Kata built with **Test-Driven Development** and **Hexagonal Architecture** (Ports & Adapters).

A squad of robotic rovers has been landed on a plateau on Mars. Each rover receives a sequence of commands to navigate a grid, rotating in cardinal directions and moving step by step.

---

## Commands

| Command | Action | Status |
|---------|--------|--------|
| `F` | Move forward one step | Implemented |
| `B` | Move backward one step | Implemented |
| `L` | Rotate 90° counter-clockwise | Implemented |
| `R` | Rotate 90° clockwise | Implemented |

Directions cycle as: `N` → `E` → `S` → `W` → `N` (rotating right).

> [!NOTE]
> Movement is direction-aware: `F`/`B` apply a delta based on the current facing direction (`N` → y+1, `S` → y−1, `E` → x+1, `W` → x−1). When the rover hits a grid edge it **rebounds**: it stays at the boundary and reverses direction. Planned feature: **obstacle detection**.

---

## Architecture

The project follows **Hexagonal Architecture** — the domain core is fully isolated from infrastructure concerns. Dependencies always point inward.

```
src/
├── domain/
│   ├── rover.ts                          # Rover entity — position and movement
│   └── ports/
│       └── command-interpreter.ts        # Driving port (inbound interface)
├── application/
│   └── rover-command-service.ts          # Implements the port, orchestrates the Rover
├── infrastructure/
│   └── command-interpreter/
│       └── terminal-command-interpreter.ts  # Adapter — parses sequences, drives the port
└── index.ts                              # Composition root — wires all layers
```

### Layer responsibilities

**Domain** — pure business logic with zero external dependencies. The `Rover` entity owns position (`x`, `y`) and direction (`N`/`E`/`S`/`W`) state. `CommandInterpreter` is the driving port: it defines what the outside world can ask the core to do.

**Application** — `RoverCommandService` implements `CommandInterpreter` and is the only place that orchestrates domain logic. It depends on the domain layer only.

**Infrastructure** — `TerminalCommandInterpreter` is a driving adapter. It accepts a raw command sequence (e.g. `"FFL"`), iterates each character, and calls `CommandInterpreter.interpret()` for each one. It depends on the port interface, never on the domain entity directly.

**Composition root** — `src/index.ts` is the only place allowed to know about all three layers simultaneously. It instantiates and wires the object graph.

### Dependency rule

```
TerminalCommandInterpreter
        │  depends on (interface only)
        ▼
CommandInterpreter  ◄──  RoverCommandService
     (port)                    │  depends on
                               ▼
                             Rover
```

> [!IMPORTANT]
> Infrastructure imports from `domain/ports` only — never from `application` or from domain concretions. This makes every adapter swappable without touching the domain or application layers.

---

## Testing

Tests mirror the source structure and are kept layer-isolated: domain tests never touch infrastructure, and adapter tests run against a mock port.

```bash
# Run tests once with coverage report
yarn test:cov

# Run tests in watch mode
yarn test

# Run a single test file
yarn vitest run tst/domain/rover.test.ts
```

| Test file | What it covers |
|-----------|----------------|
| `tst/domain/rover.test.ts` | `Rover` entity in isolation |
| `tst/application/rover-command-service.test.ts` | App service satisfies the `CommandInterpreter` port |
| `tst/infrastructure/.../terminal-command-interpreter.test.ts` | Adapter sequence parsing against a mock port |

> [!TIP]
> Because the application service and adapter depend on interfaces, every test can use plain `vi.fn()` mocks — no real infrastructure required.

---

## Getting Started

**Prerequisites:** Node.js >= 22, Yarn >= 1.22

```bash
yarn install
yarn build   # compile TypeScript to dist/
yarn start   # run compiled output
```

---

## Tech Stack

| | Purpose |
|---|---|
| TypeScript | Primary language, strict ESM (`"type": "module"`) |
| Vitest | Test runner and coverage (`@vitest/coverage-v8`) |
| Node.js | Runtime with native ESM module resolution |
