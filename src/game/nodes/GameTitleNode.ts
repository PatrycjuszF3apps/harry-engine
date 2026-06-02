import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Input} from '../../engine/core/Input';
import {Compositor} from '../../engine/graphics/Compositor';
import {WebGLUtils} from '../../engine/graphics/WebGLUtils';

export class GameTitleNode extends BaseNode {
    private _titleTexture: WebGLTexture | null = null;
    private _canvas: HTMLCanvasElement;
    startingByKeyPress = false

    constructor() {
        super('game-title');
        this._canvas = document.createElement('canvas');
        // Default dimensions, will be overwritten by parent/main
        this.width = 800;
        this.height = 600;
    }

    private _gamePaused: boolean = false;

    protected selfLogic(): void {
        // Enter starts game only when NOT in pause mode.
        // Resume from pause is handled by HarryRoot via ESC hook.
        if (!this._gamePaused && Input.isDown('Enter')) {
            this.startingByKeyPress = true;
        }
    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
        // Draw white background
        // compositor.drawRect(1, 1, 1, 1, matrix); 

        // Check if texture exists and dimensions match
        if (!this._titleTexture || this._canvas.width !== this.width || this._canvas.height !== this.height) {
            this.createTitleTexture(gl);
        }

        if (this._titleTexture) {
            // Draw title texture on top
            compositor.drawTexture(this._titleTexture, 0, 0, this.width, this.height, matrix);
        }
    }

    public setGamePaused(paused: boolean) {
        this._gamePaused = paused;
        this._titleTexture = null;
    }

    private createTitleTexture(gl: WebGL2RenderingContext) {
        // Set canvas size to match node
        this._canvas.width = this.width;
        this._canvas.height = this.height;

        const ctx = this._canvas.getContext('2d');
        if (!ctx) return;

        // Clear (transparent)
        ctx.clearRect(0, 0, this.width, this.height);

        // Draw title
        ctx.font = 'bold 48px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Harry game', this.width / 2, this.height / 2 - 50);

        // Draw subtitle
        ctx.font = '24px sans-serif';
        const subTitle = this._gamePaused ? "Press ESC to return to game" : "Press return to begin";
        ctx.fillText(subTitle, this.width / 2, this.height / 2 + 20);

        // If texture already exists, delete it to free memory
        if (this._titleTexture) {
            gl.deleteTexture(this._titleTexture);
        }

        // Create new texture
        this._titleTexture = WebGLUtils.createTextureFromCanvas(gl, this._canvas);
    }
}
