import * as PIXI from "pixi.js";

export class StageLayer extends PIXI.Container {

    public constructor() {
        super();
        addEventListener('added', this.onAddedToStage);
    }

    private onAddedToStage(evt: Event) {
        console.log(evt);
        //this.width = parent.width;
        //this.height = parent.height;
    }
}
