import type { StartSceneResourcesPackage } from "./resources/StartSceneResourcesPackage";

import { StartSceneController } from "./controller/StartSceneController";
import { Viewable } from "../../../scene/viewable/Viewable";
import { StartSceneView } from "./view/StartSceneView";

export class StartScene extends Viewable<void>
{
    private constructor(startSceneResourcePackage: StartSceneResourcesPackage) {
        super();

        const controller = new StartSceneController(this.operationControls);
        this.view = new StartSceneView(controller, startSceneResourcePackage);
    }

    public static async build(startSceneResourcePackage: StartSceneResourcesPackage): Promise<StartScene> {
        return Promise.resolve(new StartScene(startSceneResourcePackage));
    }
}