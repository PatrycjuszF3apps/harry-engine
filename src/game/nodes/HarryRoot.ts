import {BaseNode} from '../../engine/core/BaseNode.ts';
import {Compositor} from '../../engine/graphics/Compositor';
import {Input} from '../../engine/core/Input';
import {GameTitleNode} from './GameTitleNode';
import {RunningGameContainerNode} from "./RunningGameContainerNode.ts";
import {MenuContainerNode} from "./MenuContainerNode.ts";

export class HarryRoot extends BaseNode {

    public static readonly PAUSE_STATE_NONE = 'none'
    public static readonly PAUSE_STATE_PAUSING = 'pausing'
    public static readonly PAUSE_STATE_REASSUMING = 'reassuming'
    public static readonly PAUSE_STATE_PAUSED = 'paused'


    private pauseState: string = HarryRoot.PAUSE_STATE_NONE

    constructor() {
        super("root", false); // Root doesn't need a buffer, renders to screen
    }

    private setNextPauseState() {
        let order = [
            HarryRoot.PAUSE_STATE_NONE,
            HarryRoot.PAUSE_STATE_PAUSING,
            HarryRoot.PAUSE_STATE_PAUSED,
            HarryRoot.PAUSE_STATE_REASSUMING
        ]

        this.pauseState = order[(order.indexOf(this.pauseState) + 1) % order.length]
    }

    protected selfLogic(_dt: number): void {
        this.escapeKeyAction()


        this.addHook((node: BaseNode) => {
            if (node instanceof GameTitleNode) {
                if (node.startingByKeyPress) {
                    node.startingByKeyPress = false

                    this.addHook((node: BaseNode) => {
                        if (node instanceof RunningGameContainerNode) {
                            node.enable()
                            this.addHook((node: BaseNode) => {
                                if (node instanceof MenuContainerNode) {
                                    node.disable()
                                    return true
                                }
                            });
                            return true
                        }
                    })

                }
                return true
            }
        })
    }

    private escapeKeyAction() {
        if (Input.isPressed('Escape') && (HarryRoot.PAUSE_STATE_NONE === this.pauseState || HarryRoot.PAUSE_STATE_PAUSED === this.pauseState)) {

            this.setNextPauseState()
            console.log(this.pauseState)
            this.addHook((node: BaseNode) => {

                if (node instanceof RunningGameContainerNode) {
                    if (HarryRoot.PAUSE_STATE_PAUSING === this.pauseState) {
                        node.disable()
                    }

                    if (HarryRoot.PAUSE_STATE_REASSUMING === this.pauseState) {
                        node.enable()
                    }

                    this.addHook((node: BaseNode) => {
                        if (node instanceof MenuContainerNode) {
                            if (HarryRoot.PAUSE_STATE_PAUSING === this.pauseState) {
                                console.log('menu container enable')
                                node.enable()
                            }

                            if (HarryRoot.PAUSE_STATE_REASSUMING === this.pauseState) {
                                node.disable()
                            }

                            this.addHook((node: BaseNode) => {
                                if (node instanceof GameTitleNode) {
                                    if (HarryRoot.PAUSE_STATE_PAUSING === this.pauseState) {
                                        console.log('game title node')
                                        console.log(node)
                                        node.setGamePaused(true)
                                        this.pauseState = HarryRoot.PAUSE_STATE_PAUSED
                                    }

                                    if (HarryRoot.PAUSE_STATE_REASSUMING === this.pauseState) {
                                        node.setGamePaused(false)
                                        this.pauseState = HarryRoot.PAUSE_STATE_NONE
                                    }

                                    return true
                                }
                            })
                            return true
                        }
                    })
                    return true
                }
            })
        }

    }

    protected selfRender(gl: WebGL2RenderingContext, _compositor: Compositor, _matrix: Float32Array): void {
        // Root clears the main screen to dark gray
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);


        /*this.addHook(node: Node)=> {
            if (node instanceof GameMapContainerNode && Input.key==="ESC") {
                node.visible = false

                //nested hook should wait for next TreeProcessor cycle?
                this.addHook(node: Node)=> {
                    if (node instanceof MainMenuContainerNode) {
                        node.visible = true
                    }
                }
        }*/
    }

}
