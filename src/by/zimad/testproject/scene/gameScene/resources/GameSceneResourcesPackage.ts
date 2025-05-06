import { Texture, ILoaderResource } from "pixi.js";
import { BaseResourcesPackage } from "../../../../resources/BaseResourcesPackage";
export class GameSceneResourcesPackage extends BaseResourcesPackage {
    public get assets_game_1_png(): Texture {
        return this.texture("assets/game/1.png");
    }
    public get assets_game_10_png(): Texture {
        return this.texture("assets/game/10.png");
    }
    public get assets_game_11_png(): Texture {
        return this.texture("assets/game/11.png");
    }
    public get assets_game_12_png(): Texture {
        return this.texture("assets/game/12.png");
    }
    public get assets_game_13_png(): Texture {
        return this.texture("assets/game/13.png");
    }
    public get assets_game_14_png(): Texture {
        return this.texture("assets/game/14.png");
    }
    public get assets_game_15_png(): Texture {
        return this.texture("assets/game/15.png");
    }
    public get assets_game_16_png(): Texture {
        return this.texture("assets/game/16.png");
    }
    public get assets_game_2_png(): Texture {
        return this.texture("assets/game/2.png");
    }
    public get assets_game_3_png(): Texture {
        return this.texture("assets/game/3.png");
    }
    public get assets_game_4_png(): Texture {
        return this.texture("assets/game/4.png");
    }
    public get assets_game_5_png(): Texture {
        return this.texture("assets/game/5.png");
    }
    public get assets_game_6_png(): Texture {
        return this.texture("assets/game/6.png");
    }
    public get assets_game_7_png(): Texture {
        return this.texture("assets/game/7.png");
    }
    public get assets_game_8_png(): Texture {
        return this.texture("assets/game/8.png");
    }
    public get assets_game_9_png(): Texture {
        return this.texture("assets/game/9.png");
    }
    public get assets_game_bar_png(): Texture {
        return this.texture("assets/game/bar.png");
    }
    public get assets_game_base_mask_png(): Texture {
        return this.texture("assets/game/base_mask.png");
    }
    public get assets_game_frame_png(): Texture {
        return this.texture("assets/game/frame.png");
    }
    public get assets_game_game_scene_bg_jpg(): Texture {
        return this.texture("assets/game/game_scene_bg.jpg");
    }
    public get assets_game_grid_png(): Texture {
        return this.texture("assets/game/grid.png");
    }
    public get assets_game_hand_png(): Texture {
        return this.texture("assets/game/hand.png");
    }
    public get assets_game_image_jpg(): Texture {
        return this.texture("assets/game/image.jpg");
    }
    public get assets_game_play_button_png(): Texture {
        return this.texture("assets/game/play_button.png");
    }
    protected registerResourcesForDownload(): void {
        this.add("assets/game/1.png")
        this.add("assets/game/10.png")
        this.add("assets/game/11.png")
        this.add("assets/game/12.png")
        this.add("assets/game/13.png")
        this.add("assets/game/14.png")
        this.add("assets/game/15.png")
        this.add("assets/game/16.png")
        this.add("assets/game/2.png")
        this.add("assets/game/3.png")
        this.add("assets/game/4.png")
        this.add("assets/game/5.png")
        this.add("assets/game/6.png")
        this.add("assets/game/7.png")
        this.add("assets/game/8.png")
        this.add("assets/game/9.png")
        this.add("assets/game/bar.png")
        this.add("assets/game/base_mask.png")
        this.add("assets/game/frame.png")
        this.add("assets/game/game_scene_bg.jpg")
        this.add("assets/game/grid.png")
        this.add("assets/game/hand.png")
        this.add("assets/game/image.jpg")
        this.add("assets/game/play_button.png")
    }
}