import { StartSceneResourcesPackage } from "../startScene/resources/StartSceneResourcesPackage";
import { GameSceneResourcesPackage } from "../gameScene/resources/GameSceneResourcesPackage";
import { PreloaderSceneResourcesPackage } from "./resources/PreloaderSceneResourcesPackage";
import { PreloaderSceneController } from "./controller/PreloaderSceneController";
import { ResourceManager } from "../../../resources/ResourceManager";
import { PreloaderConfigModel } from "./model/PreloaderConfigModel";
import { PreloaderSceneView } from "./view/PreloaderSceneView";
import { Viewable } from "../../../scene/viewable/Viewable";

export class PreloaderScene extends Viewable<PreloaderConfigModel>
{
    public constructor(resourceManager: ResourceManager) {
        super();
        const controller = new PreloaderSceneController();
        this.view = new PreloaderSceneView(controller, resourceManager, this.operationControls);
    }

    public static async build(): Promise<PreloaderScene> {
        const resourceManager = new ResourceManager();
        
        resourceManager.registerResourcePackage(new PreloaderSceneResourcesPackage());
        resourceManager.registerResourcePackage(new StartSceneResourcesPackage());
        resourceManager.registerResourcePackage(new GameSceneResourcesPackage());

        return Promise.resolve(new PreloaderScene(resourceManager));
    }
}