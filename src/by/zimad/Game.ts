import type { AbstractRenderer, Renderer } from "pixi.js";

import { PreloaderConfigModel } from "./testproject/scene/preloaderScene/model/PreloaderConfigModel";
import { ResourcesConfigModel } from "./testproject/scene/preloaderScene/model/ResourcesConfigModel";
import { PreloaderScene } from "./testproject/scene/preloaderScene/PreloaderScene";
import { SafeAreaProvider } from "./testproject/tools/SafeAreasProvider";
import { DummyItemFactory } from "./scene/transition/DunnyItemFactory";
import { StartScene } from "./testproject/scene/startScene/StartScene";
import { DummyTransition } from "./scene/transition/DummyTransition";
import { GameScene } from "./testproject/scene/gameScene/GameScene";
import { Application, Container, Sprite } from "pixi.js";
import { SceneManager } from "./scene/SceneManager";
import MiniSignal from 'mini-signals';

export class Game extends Application {
    public static readonly WIDTH: number = 1080;
    public static readonly HEIGHT: number = 1920;

    public static RENDERER: Renderer | AbstractRenderer;
    public static UPDATE_SIGNAL: MiniSignal;

    private readonly safeArea: number;
    private gameContainer: Container;
    private sceneManager: SceneManager;

    public constructor(isMobile: boolean) {
        super({
            backgroundColor: 0xFFFFFF
        });
        this.safeArea = SafeAreaProvider.getSafeArea();
        this.ticker.add(this.dispatchUpdateEvent, this);

        Game.UPDATE_SIGNAL = new MiniSignal();
        Game.RENDERER = this.renderer;
    }

    public async launch(): Promise<void> {
        this.gameContainer = new Container();
        this.gameContainer.pivot.set(Game.WIDTH / 2, Game.HEIGHT / 2);
        this.stage.addChild(this.gameContainer);
        this.sceneManager = new SceneManager(this.gameContainer, new DummyTransition(new DummyItemFactory(), 0));
        window.onresize = () => { this.onRendererResize(window.innerWidth, window.innerHeight) };
        window.addEventListener("orientationchange", () => {
            window.dispatchEvent(new Event("resize"));
        }, false);
        this.onRendererResize(window.innerWidth, window.innerHeight);
        this.showPreloader();
    }

    private onRendererResize(screenWidth: number, screenHeight: number): void {
        const width = screenWidth * devicePixelRatio;
        const height = screenHeight * devicePixelRatio;
        this.renderer.resize(width, height);
        this.view.style.transform = `scale(${1 / devicePixelRatio})`;
        this.scaleContainer(this.gameContainer, width, height, Game.WIDTH, Game.HEIGHT);
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    private scaleContainer(container: Container, realWidth: number, realHeight: number, desiredWidth: number, desiredHeight: number): void {
        const scaleFactor = Math.min(
            realWidth / (desiredWidth - this.safeArea),
            realHeight / (desiredHeight - this.safeArea));
        container.scale.set(scaleFactor, scaleFactor);
        container.position.set(this.screen.width / 2, this.screen.height / 2);
    }

    private async showPreloader(): Promise<void> {
        const preloaderScene = await PreloaderScene.build();
        const preloaderSceneOperation = this.sceneManager.showViewableAsync(preloaderScene);

        preloaderSceneOperation.then(async (preloaderConfigModel: PreloaderConfigModel) => {
            this.showStartScene(preloaderConfigModel.resources);

            const logo = new Sprite(preloaderConfigModel.resources.preloaderSceneResourcesPackage.assets_preloader_logo_png);
            logo.y += logo.height / 5;
            this.gameContainer.addChild(logo);
        });
    }

    private async showStartScene(resources: ResourcesConfigModel): Promise<void> {
        const startScene = await StartScene.build(resources.startSceneResourcesPackage);
        const startSceneOperation = this.sceneManager.showViewableAsync(startScene);

        startSceneOperation.then(async () => this.showGameScene(resources));
    }

    private async showGameScene(resources: ResourcesConfigModel): Promise<void> {
        const gameScene = await GameScene.build(resources.gameSceneResourcesPackage);
        this.sceneManager.showViewableAsync(gameScene);
    }

    private dispatchUpdateEvent(dt: number): void {
        Game.UPDATE_SIGNAL.dispatch(this.ticker.elapsedMS);
    }
}