import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Compositor} from '../../engine/graphics/Compositor';

export class UINode extends BaseNode {
    constructor() {
        // UI also has its own buffer, sits "beside" the map (neighbor)
        super("ui_layer", true);
        this.width = 200;
        this.height = 100;
        this.x = 50;
        this.y = 50; // Overrides the map but is on top
    }

    protected selfLogic(dt: number): void {
        // Health bar animation
    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
        // Semi-transparent UI background
        //gl.clearColor(0, 0, 0.5, 0.5);
        //gl.clear(gl.COLOR_BUFFER_BIT);

        // White frame (simulated)
    }
}