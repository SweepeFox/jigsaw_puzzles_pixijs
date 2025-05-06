import type { StartSceneResourcesPackage } from "../../startScene/resources/StartSceneResourcesPackage";
import type { GameSceneResourcesPackage } from "../../gameScene/resources/GameSceneResourcesPackage";
import type { PreloaderSceneResourcesPackage } from "../resources/PreloaderSceneResourcesPackage";

export class ResourcesConfigModel {
    public preloaderSceneResourcesPackage: PreloaderSceneResourcesPackage;
    public startSceneResourcesPackage: StartSceneResourcesPackage;
    public gameSceneResourcesPackage: GameSceneResourcesPackage;
}