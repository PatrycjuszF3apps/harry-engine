import {Compositor} from "../../graphics/Compositor.ts";


export interface NodeInterface {
    visible: boolean;
    active: boolean;
    destroyed: boolean;

    parent: NodeInterface | null;
    children: NodeInterface[];

    selfLogic(dt: number): void;
    selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void;
    destroy(): void;
}