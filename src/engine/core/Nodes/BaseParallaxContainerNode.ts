import {BaseNode} from "../BaseNode.ts";
import {Compositor} from "../../graphics/Compositor.ts";


export abstract class BaseParallaxContainerNode extends BaseNode {
    protected assetsDirectoryName: string;


    protected selfLogic(dt: number): void {


    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
    }
}