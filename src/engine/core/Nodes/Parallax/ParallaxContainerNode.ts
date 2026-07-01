import {BaseNode} from "../../BaseNode.ts";
import {Compositor} from "../../../graphics/Compositor.ts";
import {Asset} from "../../../assets/Asset.ts";
import {AssetFactory} from "../../../assets/AssetFactory.ts";
import {ParallaxItemNode} from "./ParallaxItemNode.ts";
import {WebGLUtils} from "../../../graphics/WebGLUtils.ts";


export class ParallaxContainerNode extends BaseNode {
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

        const assets: Asset[] = []
        const baseLocation = '../../assets/parallax/'
        for (let i = 1; i < 40; i++) {
            const resourceUrl = baseLocation + i.toString() + '_900px.png'
            assets.push(AssetFactory.create(resourceUrl))
        }

        assets.forEach((asset) => {
            console.log(asset)
            const parallaxItemNode = new ParallaxItemNode()
            this.loadTexture(parallaxItemNode, gl, asset)
            parallaxItemNode.width = this.getRandomInt(50, 300);
            parallaxItemNode.height = this.getRandomInt(50, 300);
            parallaxItemNode.x = this.getRandomInt(0, 2000);
            parallaxItemNode.y = this.getRandomInt(0, 1000);
            parallaxItemNode.speed = this.getRandomInt(100, 1000);
            this.addChild(parallaxItemNode);
        })

    }

    async loadTexture(item: ParallaxItemNode, gl: WebGL2RenderingContext, asset: Asset) {
        try {
            item.texture = await WebGLUtils.loadTexture(gl, asset._resourceUrl);
        } catch (error) {
            console.error("Error loading texture:", error);
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