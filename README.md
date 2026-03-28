# Mars Rover Kata

A robust implementation of the **Mars Rover Kata** using Test-Driven Development (TDD) and **Hexagonal Architecture** (Ports & Adapters). The project focuses on high maintainability, separation of concerns, and domain-driven design principles to navigate a rover through a grid-based terrain via remote commands.

---

## Problem Description

A squad of robotic rovers has been landed on a plateau on Mars. The plateau is divided into a grid to simplify navigation. A rover's position and heading are represented by a combination of x/y coordinates and a cardinal direction (N, S, E, W).

Rovers receive a string of commands and must:

- Move forward/backward across the grid
- Rotate left or right in 90-degree increments
- Detect and report obstacles before moving into them
- Wrap around the edges of the grid (toroidal surface)

### Commands

| Command | Action |
|---------|--------|
| `F` | Move forward one grid point |
| `B` | Move backward one grid point |
| `L` | Rotate 90° left (counter-clockwise) |
| `R` | Rotate 90° right (clockwise) |

### Cardinal Directions

`N` → `E` → `S` → `W` → `N` (rotating right)

---

## Architecture

This project follows **Hexagonal Architecture** (also known as Ports & Adapters), keeping the domain logic fully isolated from infrastructure concerns.

```
src/
├── domain/                   # Core business logic — no external dependencies
│   ├── rover/                # Rover entity, position, and direction
│   ├── grid/                 # Grid boundaries and wrapping logic
│   └── obstacle-detector/    # Obstacle detection port
├── application/              # Use cases and command handlers
│   └── move-rover/           # Command dispatching and sequencing
└── infrastructure/           # Adapters (CLI, file input, etc.)
    └── command-parser/       # Parses raw input into domain commands
```

> The `src/index.ts` entry point wires up the application.

### Key Design Principles

- **Domain-Driven Design**: the rover, grid, and obstacle detection are modeled as first-class domain concepts
- **Ports & Adapters**: the domain exposes interfaces (ports); infrastructure code implements them (adapters)
- **TDD**: every behavior is driven by tests written first

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn >= 1.22

### Install

```bash
yarn install
```

### Build

```bash
yarn build
```

Compiled output is written to `dist/`.

### Run

```bash
yarn start
```

---

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

```bash
# Run tests in watch mode
yarn test

# Run tests with coverage report
yarn test:cov
```

Coverage is provided by `@vitest/coverage-v8`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Primary language |
| Vitest | Test runner and coverage |
| Node.js ESM | Module system (`"type": "module"`) |

---

## License

MIT — Sebastián Bello
