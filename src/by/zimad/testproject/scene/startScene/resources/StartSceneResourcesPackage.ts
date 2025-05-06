import { Texture, ILoaderResource } from "pixi.js";
import { BaseResourcesPackage } from "../../../../resources/BaseResourcesPackage";
export class StartSceneResourcesPackage extends BaseResourcesPackage {
    public get assets_start_start_button_png(): Texture {
        return this.texture("assets/start/start_button.png");
    }
    public get assets_start_start_scene_bg_jpg(): Texture {
        return this.texture("assets/start/start_scene_bg.jpg");
    }
    protected registerResourcesForDownload(): void {
        this.add("assets/start/start_button.png")
        this.add("assets/start/start_scene_bg.jpg")
    }
}