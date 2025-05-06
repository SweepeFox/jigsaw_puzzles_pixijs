import * as PIXI from "pixi.js";

export abstract class BaseView extends PIXI.Container {
    public constructor() {
        super();
    }

    abstract start(): void;
}
