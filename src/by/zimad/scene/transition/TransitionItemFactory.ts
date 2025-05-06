import * as PIXI from "pixi.js";

export abstract class TransitionItemFactory {
    abstract createItem(): PIXI.Container;
}
