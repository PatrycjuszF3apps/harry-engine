import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Compositor} from '../../engine/graphics/Compositor';
import {Input} from '../../engine/core/Input';
import {ParallaxItemNode} from "./ParallaxItemNode.ts";
import {
    BaseParallaxContainerNode
} from "../../engine/core/Nodes/BaseParallaxContainerNode.ts";
import {BaseParallaxItemNode} from "../../engine/core/BaseParallaxItemNode.ts";
import {WebGLUtils} from "../../engine/graphics/WebGLUtils.ts";

export class ParallaxContainerNode extends BaseParallaxContainerNode {
    private _compositor: Compositor;
    private _viewPortWidth: number;
    private _viewPortHeight: number;

    constructor() {
        super("game_map", true);


        //const map = new GameMapNode();
        //runningGameContainer.addChild(map);

    }

    public init(gl: WebGL2RenderingContext, compositor: Compositor) {
        this._compositor = compositor;
        this._viewPortWidth = compositor.viewPortWidth;
        this._viewPortHeight = compositor.viewPortHeight;


        for (let i = 0; i < 73; i++) {
            const parallaxItemNode = new ParallaxItemNode()
            this.loadAssets(parallaxItemNode, gl, i)
            parallaxItemNode.width = this.getRandomInt(50, 300);
            parallaxItemNode.height = this.getRandomInt(50, 300);
            parallaxItemNode.x = this.getRandomInt(0, 2000);
            parallaxItemNode.y = this.getRandomInt(0, 1000);
            parallaxItemNode.speed = this.getRandomInt(100, 1000);
            this.addChild(parallaxItemNode);

        }
    }

    async loadAssets(item: BaseParallaxItemNode, gl: WebGL2RenderingContext, number: number) {
        try {
            item.texture = await WebGLUtils.loadTexture(gl, '../../assets/parallax/' + number.toString() + '.png');
            console.log("Cat texture loaded successfully!");
        } catch (error) {
            console.error("Error loading cat texture:", error);
        }
    }

    private getRandomInt(min, max): number {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    public selfLogic(dt: number): void {
        /*this.time += dt;

        if (Input.isDown('ArrowLeft')){
            console.log('ArrowLeft')
        }

        // --- KEYBOARD HANDLING ---
        if (Input.isDown('KeyA') || Input.isDown('ArrowLeft'))  this.x -= this.speed * dt;
        if (Input.isDown('KeyD') || Input.isDown('ArrowRight')) this.x += this.speed * dt;
        if (Input.isDown('KeyW') || Input.isDown('ArrowUp'))    this.y -= this.speed * dt;
        if (Input.isDown('KeyS') || Input.isDown('ArrowDown'))  this.y += this.speed * dt;*/
    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
        /*const g = (Math.sin(this.time * 2) + 1) / 2;
        gl.clearColor(0.0, 0.5 * g, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);*/

        //compositor.drawRect(1, 0, 0, 1, matrix);
    }
}