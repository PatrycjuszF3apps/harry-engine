import {HookPhase} from "./Enum/HookPhase.ts";
import {NodeInterface} from "./Interface/NodeInterface.ts";
import {BaseNode} from "./BaseNode.ts";
import {Compositor} from '../graphics/Compositor.ts';

export class TreeProcessor {
    // Instead of a single array, we have an object holding separate arrays for each phase.
    // This guarantees O(1) lookup for the appropriate hook list in the hot path.
    public hooks: Record<HookPhase, TreeHook[]> = {
        [HookPhase.BEFORE_LOGIC]: [],
        [HookPhase.AFTER_LOGIC]: [],
        [HookPhase.BEFORE_RENDER]: [],
        [HookPhase.AFTER_RENDER]: []
    };

    public graphicsConfig: {
        compositor: Compositor,
        parentBuffer: null,
        canvas: HTMLCanvasElement,
        gl: WebGL2RenderingContext
    }

    public root: BaseNode


    /**
     * Adds a hook to a specified lifecycle phase. Defaults to BEFORE_LOGIC.
     */
    public addHook(hook: TreeHook, phase: HookPhase = HookPhase.BEFORE_LOGIC): void {
        this.hooks[phase].push(hook);
    }

    /**
     * New method executing hooks only for a specific phase.
     */
    private doHooks(node: NodeInterface, phase: HookPhase): void {
        const phaseHooks = this.hooks[phase];

        for (let i = phaseHooks.length - 1; i >= 0; i--) {
            const hook = phaseHooks[i];

            if (hook(node)) {
                phaseHooks.splice(i, 1);
            }
        }
    }


    public runCycle(dt: number): void {
        // Delta Time (time in seconds since last frame)
        this.process(this.root, true, true, dt);
    }

    private process(node: BaseNode, canParentLogic: boolean, canParentRender: boolean, dt: number): void {
        // 1. SHIELD: If node is destroyed, stop immediately!
        // Its hooks, logic, render, and children loop won't execute.
        if (node.destroyed) {
            return;
        }

        node.treeProcessor = this

        // --- PHASE 1: BEFORE LOGIC ---
        this.doHooks(node, HookPhase.BEFORE_LOGIC);

        const canBranchLogic = canParentLogic && node.active;
        if (canBranchLogic) {
            node.selfLogic(dt);
        }

        // --- PHASE 2: AFTER LOGIC ---
        // Ideal place for reactions to what this node did in logic()
        this.doHooks(node, HookPhase.AFTER_LOGIC);


        // --- PHASE 3: BEFORE RENDERING ---
        this.doHooks(node, HookPhase.BEFORE_RENDER);

        const canBranchRender = canParentRender && node.visible;
        if (canBranchRender) {
            node.render(this.graphicsConfig.gl!, this.graphicsConfig.compositor, null, this.graphicsConfig.canvas.width, this.graphicsConfig.canvas.height);
        }

        // --- PHASE 4: AFTER RENDERING ---
        // Ideal for resource cleanup after rendering (e.g., buffer cleanup for this node)
        this.doHooks(node, HookPhase.AFTER_RENDER);

// --- RECURSION AND CHILD CLEANUP ---
        let hasDestroyedChildren = false;

        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];

            if (child.destroyed) {
                // We detected a dead child. Don't process it,
                // but mark that cleanup is needed after the loop.
                hasDestroyedChildren = true;
            } else {
                this.process(child, canBranchLogic, canBranchRender, dt);
            }
        }

        // --- LOCAL GARbage COLLECTION ---
        // Create a new children array only when necessary.
        // This ensures high performance.
        if (hasDestroyedChildren) {
            node.children = node.children.filter(child => !child.destroyed);
        }
    }
}