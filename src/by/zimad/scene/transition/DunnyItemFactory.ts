import * as PIXI from "pixi.js";
import { TransitionItemFactory } from "./TransitionItemFactory";

export class DummyItemFactory extends TransitionItemFactory {
    createItem(): PIXI.Container {
        return new PIXI.Container();
    }
    constructor() {
        super();
    }
}
