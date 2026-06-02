import {NodeInterface} from "../Interface/NodeInterface.ts";

export type TreeHook = (node: NodeInterface) => boolean | void;

