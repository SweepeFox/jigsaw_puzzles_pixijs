import type { GameSceneResourcesPackage } from "./resources/GameSceneResourcesPackage";

import { GameSceneController } from "./controller/GameSceneController";
import { Viewable } from "../../../scene/viewable/Viewable";
import { GameSceneModel } from "./model/GameSceneModel";
import { GameSceneView } from "./view/GameSceneView";

export class GameScene extends Viewable<void> {
    private constructor(gameSceneResourcesPackage: GameSceneResourcesPackage) {
        super();
        const model = new GameSceneModel();
        const controller = new GameSceneController(model);
        this.view = new GameSceneView(controller, model, gameSceneResourcesPackage);
    }

    public static async build(gameSceneResourcesPackage: GameSceneResourcesPackage): Promise<GameScene> {
        return Promise.resolve(new GameScene(gameSceneResourcesPackage));
    }
}