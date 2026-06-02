import {Compositor} from '../graphics/Compositor';
import {WebGLUtils} from '../graphics/WebGLUtils';
import {NodeInterface} from 'Interface/NodeInterface';
import {HookPhase} from "./Enum/HookPhase.ts";
import {TreeProcessor} from "./TreeProcessor.ts";
import {TreeHook} from "./Types/TreeHook.ts";


export abstract class BaseNode implements NodeInterface {
    // Hierarchy
    public parent: BaseNode | null = null;
    public children: BaseNode[] = [];
    public id: string;
    public treeProcessor: TreeProcessor;

    visible = true;
    active = true;
    destroyed = false;

    // Transforms (Local)
    public x: number = 0;
    public y: number = 0;
    public width: number = 100;
    public height: number = 100;

    // Buffering
    protected _useOwnBuffer: boolean = false;
    private _framebuffer: WebGLFramebuffer | null = null;
    private _texture: WebGLTexture | null = null;
    private _bufferWidth: number = 0;
    private _bufferHeight: number = 0;

    destroy(): void {
        this.destroyed = true;
        // Cascaded destruction of children
        for (const child of this.children) {
            child.destroy();
        }
    }

    abstract selfLogic(dt: number): void;


    constructor(id: string, useOwnBuffer: boolean = false) {
        this.id = id;
        this._useOwnBuffer = useOwnBuffer;
    }

    addChild(child: BaseNode) {
        child.parent = this;
        this.children.push(child);
    }

    addHook(hook: TreeHook, phase: HookPhase = HookPhase.BEFORE_LOGIC): void {
        this.treeProcessor.addHook(hook, phase);
    }


    render(gl: WebGL2RenderingContext, compositor: Compositor, parentBuffer: WebGLFramebuffer | null, screenW: number, screenH: number) {
        if (!this.visible) return;

        let targetBuffer = parentBuffer;

        // A. Buffering Logic
        if (this._useOwnBuffer) {
            this.ensureFramebuffer(gl, this.width, this.height);
            targetBuffer = this._framebuffer;

            // --- FIX FOR FEEDBACK LOOP ---
            // Detach texture from texture unit before writing to Framebuffer,
            // which is linked with it. This prevents "Feedback loop" error.
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            // ----------------------------

            gl.bindFramebuffer(gl.FRAMEBUFFER, targetBuffer);
            gl.viewport(0, 0, this.width, this.height);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, targetBuffer);
            // Note: without own buffer, we inherit parent viewport
        }

        const effectiveW = this._useOwnBuffer ? this.width : screenW;
        const effectiveH = this._useOwnBuffer ? this.height : screenH;

        const matrix = this.computeMatrix(effectiveW, effectiveH);

        // C. Self Rendering
        this.selfRender(gl, compositor, matrix);

        // D. Children Rendering
        /* for (const child of this.children) {
             child.render(gl, compositor, targetBuffer, effectiveW, effectiveH);
         }*/

        // E. Composition (Merge)
        if (this._useOwnBuffer && parentBuffer !== targetBuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, parentBuffer);
            gl.viewport(0, 0, screenW, screenH);

            const parentMatrix = this.computeTransformMatrixForParent(screenW, screenH);

            if (this._texture) {
                compositor.drawTexture(this._texture, this.x, this.y, this.width, this.height, parentMatrix);
            }
        }
    }


    public enable() {
        this.active = true;
        this.visible = true;
    }

    public disable() {
        this.visible = false;
        this.active = false;
    }

    protected abstract selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void;

    // --- Helpers ---

    private ensureFramebuffer(gl: WebGL2RenderingContext, w: number, h: number) {
        if (this._framebuffer && this._bufferWidth === w && this._bufferHeight === h) return;

        if (this._framebuffer) gl.deleteFramebuffer(this._framebuffer);
        if (this._texture) gl.deleteTexture(this._texture);

        this._bufferWidth = w;
        this._bufferHeight = h;
        this._texture = WebGLUtils.createTexture(gl, w, h);
        this._framebuffer = gl.createFramebuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    private computeMatrix(viewW: number, viewH: number): Float32Array {
        const sx = 2 / viewW * (this._useOwnBuffer ? viewW : this.width);
        const sy = -2 / viewH * (this._useOwnBuffer ? viewH : this.height);

        const tx = this._useOwnBuffer ? -1 : (this.x / viewW * 2 - 1);
        const ty = this._useOwnBuffer ? 1 : -(this.y / viewH * 2 - 1);

        return new Float32Array([
            sx, 0, 0,
            0, sy, 0,
            tx, ty, 1,
        ]);
    }

    private computeTransformMatrixForParent(viewW: number, viewH: number): Float32Array {
        const sx = 2 * this.width / viewW;
        const sy = -2 * this.height / viewH;

        const tx = (this.x / viewW * 2) - 1;
        const ty = -(this.y / viewH * 2) + 1;

        return new Float32Array([
            sx, 0, 0,
            0, sy, 0,
            tx, ty, 1,
        ]);
    }
}