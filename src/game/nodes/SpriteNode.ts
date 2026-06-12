import {Compositor} from '../../engine/graphics/Compositor';
import {Input} from '../../engine/core/Input';
import {BaseSpriteNode} from "../../engine/core/BaseSpriteNode.ts";
import {WebGLUtils} from "../../engine/graphics/WebGLUtils.ts";

export class SpriteNode extends BaseSpriteNode {
    private time = 0;
    protected speed = 300; // pixels per second

    constructor() {
        super("sprite", true);

    }

    async loadAssets(gl: WebGL2RenderingContext) {
        try {
            this.texture = await WebGLUtils.loadTexture(gl, '../../assets/cat.png');
            console.log("Cat texture loaded successfully!");
        } catch (error) {
            console.error("Error loading cat texture:", error);
        }
    }

    protected selfLogic(dt: number): void {
        this.time += dt;

        if (Input.isDown('ArrowLeft')) {
            console.log('ArrowLeft')
        }

        // --- KEYBOARD HANDLING ---
        if (Input.isDown('KeyA') || Input.isDown('ArrowLeft')) this.x -= this.speed * dt;
        if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) this.x += this.speed * dt;
        if (Input.isDown('KeyW') || Input.isDown('ArrowUp')) this.y -= this.speed * dt;
        if (Input.isDown('KeyS') || Input.isDown('ArrowDown')) this.y += this.speed * dt;
    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {

        if (this.texture) {
            // Wykorzystujemy "uładowaną" metodę z Compositora
            compositor.drawTexture(this.texture, matrix);
        }

        /*const g = (Math.sin(this.time * 2) + 1) / 2;
        gl.clearColor(0.0, 0.5 * g, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);*/
    }


}