# Technical Documentation - Harry Game Engine

## Executive Summary

Harry Game is a WebGL2-based game engine prototype implementing a hierarchical node system with scene graph architecture. The engine uses TypeScript/Vite stack and provides a foundation for 2D games targeting web platforms.

---

## Architecture Overview

### Core Components

```
┌─────────────────────────────────────────┐
│              main.ts                    │
│  - WebGL2 Context Initialization        │
│  - Scene Graph Construction             │
│  - Game Loop (requestAnimationFrame)    │
└─────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐     ┌────────▼────────┐
│   Engine Core   │     │  Game Nodes     │
│                 │     │                  │
│ - BaseNode      │     │ - HarryRoot     │
│ - TreeProcessor │     │ - MenuContainer │
│ - Input         │     │ - RunningGame   │
│ - HookSystem    │     │ - GameMap       │
└─────────────────┘     │ - UINode        │
                        │ - GameTitle     │
                        └─────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐     ┌────────▼────────┐
│   Graphics      │     │  Utilities      │
│                 │     │                  │
│ - Compositor    │     │ - WebGLUtils    │
│ - Shaders (GLSL)│     │ - NodeInterface │
│ - Framebuffers  │     │ - HookPhase     │
└─────────────────┘     └─────────────────┘
```

---

## Engine Core Architecture

### BaseNode (`src/engine/core/BaseNode.ts`)

**Purpose:** Abstract base class for all scene graph nodes.

**Key Features:**
- Hierarchical structure (parent/children relationships)
- Transform properties (x, y, width, height)
- Visibility and activity flags
- Optional framebuffer rendering (render-to-texture)
- Matrix computation for 2D transformations

**Lifecycle States:**
| State | Description |
|-------|-------------|
| `visible` | Controls render pipeline inclusion |
| `active` | Controls logic update execution |
| `destroyed` | Marks node for garbage collection |

**Buffer System:**
- Nodes can opt-in to own framebuffer (`_useOwnBuffer`)
- Automatic texture creation from framebuffer content
- Parent-child composition via texture rendering
- Feedback loop prevention (texture unbinding before render)

### TreeProcessor (`src/engine/core/TreeProcessor.ts`)

**Purpose:** Central game loop orchestrator managing node lifecycle.

**Hook System (4 Phases):**
```typescript
enum HookPhase {
    BEFORE_LOGIC,   // Pre-update hooks
    AFTER_LOGIC,    // Post-update hooks  
    BEFORE_RENDER,  // Pre-render hooks
    AFTER_RENDER    // Post-render hooks
}
```

**Execution Flow per Frame:**
1. `BEFORE_LOGIC` hooks execute
2. Node `selfLogic(dt)` if active
3. `AFTER_LOGIC` hooks execute
4. `BEFORE_RENDER` hooks execute  
5. Node `render()` if visible
6. `AFTER_RENDER` hooks execute
7. Recurse to children (with inherited flags)
8. Garbage collect destroyed children

**Performance Optimizations:**
- O(1) hook lookup via phase-indexed arrays
- Conditional execution based on parent state
- Lazy garbage collection (only when needed)

### Input System (`src/engine/core/Input.ts`)

**Purpose:** Keyboard input abstraction with frame-based detection.

**API:**
| Method | Behavior |
|--------|----------|
| `isDown(code)` | Key held down (continuous) |
| `isPressed(code)` | Single-frame press detection |
| `update()` | Clear pressed state (call end of frame) |

**Implementation:** Dual Set tracking (`keys` for held, `keysPressed` for new presses)

---

## Graphics System

### Compositor (`src/engine/graphics/Compositor.ts`)

**Purpose:** WebGL rendering utilities using single universal shader.

**Shader Capabilities:**
- 2D matrix transformations (3x3 matrices)
- Texture rendering with UV mapping
- Solid color rectangle rendering
- Alpha blending support

**Geometry:** Single unit quad (0..1 coordinates) scaled via matrices

### WebGLUtils (`src/engine/graphics/WebGLUtils.ts`)

**Utility Functions:**
- `createShader()` - GLSL shader compilation with error handling
- `createProgram()` - Shader program linking
- `createTexture()` - Empty texture creation (NEAREST filtering for pixel art)
- `createTextureFromCanvas()` - Canvas-to-texture conversion (LINEAR filtering, Y-flip support)

---

## Game Nodes Structure

### Scene Graph Hierarchy

```
HarryRoot (full screen, no buffer)
├── RunningGameContainerNode (disabled by default)
│   ├── GameMapNode (800x600, own buffer)
│   └── UINode (200x100, own buffer)
└── MenuContainerNode (enabled by default)
    └── GameTitleNode (full screen, canvas-based texture)
```

### Node Details

| Node | Buffer | Purpose | Key Features |
|------|--------|---------|--------------|
| **HarryRoot** | No | Root container | Pause state management, ESC handling via hooks |
| **MenuContainer** | No | Menu layer wrapper | Empty container for menu elements |
| **GameTitleNode** | No | Title screen | Canvas-based text rendering, pause indicator |
| **RunningGameContainer** | No | Gameplay wrapper | Disabled until game starts |
| **GameMapNode** | Yes | Game world | WASD/arrow movement, animated background |
| **UINode** | Yes | HUD layer | Positioned over map (placeholder) |

---

## Build Configuration

### Toolchain
- **TypeScript:** ES2020 target, strict mode enabled
- **Vite:** ES modules bundling, dev server with hot reload
- **WebGL2:** Modern browser requirement

### tsconfig.json Highlights
```json
{
  "moduleResolution": "bundler",
  "allowImportingTsExtensions": true,
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```