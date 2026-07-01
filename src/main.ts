import {Compositor} from './engine/graphics/Compositor';
import {HarryRoot} from './game/nodes/HarryRoot';
import {UINode} from './game/nodes/UINode';
import {GameTitleNode} from './game/nodes/GameTitleNode';
import {Input} from './engine/core/Input';
import './style.css';
import {
    RunningGameContainerNode
} from "./game/nodes/RunningGameContainerNode";
import {MenuContainerNode} from "./game/nodes/MenuContainerNode";
import {TreeProcessor} from "./engine/core/TreeProcessor.ts";
import {
    ParallaxContainerNode
} from "./engine/core/Nodes/Parallax/ParallaxContainerNode.ts";

// 1. WebGL2 Initialization
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

// Set alpha: false for better performance (assuming the game is not transparent)
const gl = canvas.getContext('webgl2', {alpha: false}) as WebGL2RenderingContext;
if (!gl) {
    throw new Error("Error: Your browser does not support WebGL2!");
}


// Enable blending (essential for UI and text)
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// 2. Window resize handling
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // WebGL viewport update is crucial after canvas size change
    gl!.viewport(0, 0, canvas.width, canvas.height);
}

// Listen for resize events
window.addEventListener('resize', resize);
// First call to fit canvas on startup
resize();

// 3. Engine Systems Initialization
// Keyboard input initialization
Input.init();
// Graphics compositor initialization (Our "Painter")
const compositor = new Compositor(gl);

// 4. Game Scene Construction (Node Tree)
const root = new HarryRoot();
// Root always occupies full screen
root.width = canvas.width;
root.height = canvas.height;

const runningGameContainer = new RunningGameContainerNode();

// Add game map (has its own buffer)
const parallaxContainer = new ParallaxContainerNode();


parallaxContainer.init(gl, compositor)



runningGameContainer.addChild(parallaxContainer);

// Add user interface (has its own buffer, sits above the map)
const ui = new UINode();
runningGameContainer.addChild(ui)
runningGameContainer.disable()
root.addChild(runningGameContainer)

const menuContainerNode = new MenuContainerNode()

// Add title screen (at the very top)
const title = new GameTitleNode();
title.width = canvas.width;
title.height = canvas.height;
title.enable()
menuContainerNode.addChild(title)
menuContainerNode.enable()
root.addChild(menuContainerNode)

// 5. Game Loop
let lastTime = performance.now();

const treeProcessor = new TreeProcessor()
treeProcessor.graphicsConfig = {
    compositor,
    parentBuffer: null,
    canvas,
    gl
}
treeProcessor.root = root

function loop(time: number) {
    // Calculate Delta Time (time in seconds since last frame)
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    treeProcessor.runCycle(dt)

    // C. Input cleanup (for isPressed)
    Input.update();

    // Zlecenie wyrysowania kolejnej klatki
    requestAnimationFrame(loop);
}


// Start pętli
requestAnimationFrame(loop);