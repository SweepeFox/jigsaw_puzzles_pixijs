import type { StartSceneResourcesPackage } from "../resources/StartSceneResourcesPackage";
import type { StartSceneController } from "../controller/StartSceneController";

import { PointerEvent } from "../../../../ui/events/PointerEvent";
import { BaseView } from "../../../../scene/viewable/BaseView";
import { Button } from "../../../../ui/widgets/Button";
import { Game } from "../../../../Game";
import { Sprite } from "pixi.js";

export class StartSceneView extends BaseView {
    private readonly controller: StartSceneController;
    private readonly resourcesPackage: StartSceneResourcesPackage;

    private readonly startButtonBottomPadding = 200;

    public constructor(controller: StartSceneController, resourcesPackage: StartSceneResourcesPackage) {
        super();
        this.controller = controller;
        this.resourcesPackage = resourcesPackage;
        this.start();
    }

    public start(): void {
        const background = new Sprite(this.resourcesPackage.assets_start_start_scene_bg_jpg);
        background.width = Game.WIDTH;
        background.height = Game.HEIGHT;
        this.addChild(background);

        const startButton = new Button(this, this.resourcesPackage.assets_start_start_button_png);
        startButton.anchor.set(0.5, 1);
        startButton.position.set(background.width / 2, background.height - this.startButtonBottomPadding);

        startButton.on(PointerEvent.Up, () => this.controller.onStart());
    }
}