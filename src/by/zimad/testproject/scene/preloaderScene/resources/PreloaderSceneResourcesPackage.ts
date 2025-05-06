import { Texture, ILoaderResource } from "pixi.js";
import { BaseResourcesPackage } from "../../../../resources/BaseResourcesPackage";
export class PreloaderSceneResourcesPackage extends BaseResourcesPackage {
    public get assets_preloader_logo_png(): Texture {
        return this.texture("assets/preloader/logo.png");
    }
    protected registerResourcesForDownload(): void {
        this.add("assets/preloader/logo.png")
    }
}