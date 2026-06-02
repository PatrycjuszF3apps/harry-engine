import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Compositor} from '../../engine/graphics/Compositor';
import {Input} from '../../engine/core/Input';

export class RunningGameContainerNode extends BaseNode {

    private _gamePaused: boolean = false;


    constructor() {
        super("running_game_container", false);
    }

    protected selfLogic(dt: number): void {


    }

    protected selfRender(gl: WebGL2RenderingContext, compositor: Compositor, matrix: Float32Array): void {
    }


    public setGamePaused(paused: boolean) {
        this._gamePaused = paused;
    }

}