# Harry — Experimental 2D Game Engine

> Named after my cat. Early-stage, experimental, subject to breaking changes.

Harry is a lightweight 2D game engine built with **TypeScript** and **WebGL**, bundled via **Vite**. The project is in early development — architecture evolves frequently.

## Tech Stack

- **TypeScript** (strict mode, ES2020)
- **WebGL** — custom compositor and rendering utilities
- **Vite** — dev server and bundler
- **Docker + Docker Compose** — containerized dev environment (optimized for Windows + WSL2)

## Installation

To get the project up and running, it is recommended to use [Task](https://taskfile.dev/docs/installation).

### Prerequisites

- **Docker** and **Docker Compose**
- [Task](https://taskfile.dev/docs/installation)

### Setup and Running

You can manage the development environment using the tasks defined in `Taskfile.yml`.

1. **Build and start the environment**:
   ```bash
   task build
   task up
   ```
   This will rebuild all necessary images and start the containers.

2. **Run the application**:
   Once the services are running, you can run the application inside the container:
   ```bash
   task run
   ```

3. **Interactive Shell**:
   If you need to execute commands directly inside the `game_dev` container:
   ```bash
   task shell
   ```

4. **Stopping the environment**:
   To stop the containers:
   ```bash
   task stop
   ```
   Or to remove all containers and volumes (destructive):
   ```bash
   task down
   ```

---
