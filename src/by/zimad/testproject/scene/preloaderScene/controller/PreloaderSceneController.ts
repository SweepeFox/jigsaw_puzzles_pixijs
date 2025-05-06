import type { ResourceManager } from "../../../../resources/ResourceManager";

import { StartSceneResourcesPackage } from "../../startScene/resources/StartSceneResourcesPackage";
import { GameSceneResourcesPackage } from "../../gameScene/resources/GameSceneResourcesPackage";
import { PreloaderSceneResourcesPackage } from "../resources/PreloaderSceneResourcesPackage";
import { ResourcesConfigModel } from "../model/ResourcesConfigModel";

export class PreloaderSceneController {
    public async load(resourceManager: ResourceManager): Promise<ResourcesConfigModel> {
        const resourcesConfigModel = new ResourcesConfigModel();
        resourcesConfigModel.preloaderSceneResourcesPackage = await resourceManager.getResourcePackage(PreloaderSceneResourcesPackage);
        resourcesConfigModel.startSceneResourcesPackage = await resourceManager.getResourcePackage(StartSceneResourcesPackage);
        resourcesConfigModel.gameSceneResourcesPackage = await resourceManager.getResourcePackage(GameSceneResourcesPackage);
        return Promise.resolve(resourcesConfigModel);
    }
}