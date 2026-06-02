import { BaseNode } from '../../engine/core/BaseNode.ts';
import { Compositor } from '../../engine/graphics/Compositor';
import { Input } from '../../engine/core/Input';

export class GameMapNode extends BaseNode {
    private time = 0;
    private speed = 300; // pixels per second

    constructor() {
        super("game_map", true);
        this.width = 800;
        this.height = 600;
        this.x = 100;
        this.y = 50;
    }

    protected selfLogic(dt: number): void {
        this.time += dt;

        if (Input.isDown('ArrowLeft')){
            console.log('ArrowLeft')
        }

        // --- KEYBOARD HANDLING ---
        if (Input.isDown('KeyA') || Input.isDown('ArrowLeft'))  this.x -= this.speed * dt;
        if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) this.x += this.speed * dt;
        if (Input.isDown('KeyW') || Input.isDown('ArrowUp'))    this.y -= this.speed * dt;
        if (Input.isDown('KeyS') || Input.isDown('ArrowDown'))  this.y += this.speed * dt;
    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
        const g = (Math.sin(this.time * 2) + 1) / 2;
        gl.clearColor(0.0, 0.5 * g, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //compositor.drawRect(1, 0, 0, 1, matrix);
    }
}