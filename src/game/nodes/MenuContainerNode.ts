import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Compositor} from '../../engine/graphics/Compositor';
import {Input} from '../../engine/core/Input';

export class MenuContainerNode extends BaseNode {


    constructor() {
        super("menu_container", false);
    }

    protected selfLogic(dt: number): void {


    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
    }


}